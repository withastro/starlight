# Feature request: traversal control (`SKIP`) and/or ancestor access for HAST visitors

## TL;DR

Sätteri's HAST visitor is a **filtered-dispatch** model: the (Rust) walker filters by tag name and
hands only matched nodes to JS, with **no ancestry information and no way to stop descending**. That
makes a whole class of context-dependent transforms awkward or impossible to express directly — the
canonical one being "add `dir` to `<pre>`/`<code>`, but leave a `<code>` that's nested inside a
`<pre>` alone."

`unist-util-visit` (what the remark/rehype/unified pipeline uses) gives plugin authors both halves of
the traversal contract: the **ancestor stack** (`(node, index, parents)`) and **traversal control**
(`SKIP` / `CONTINUE` / `EXIT`). Sätteri traded these away for Rust-side filtering. This proposes
adding (at least) `SKIP` back, and optionally ancestor access, so visitors can match the ergonomics
and correctness of their unified counterparts.

## Background — the current visitor model

(Types from `satteri`'s `src/hast/hast-visitor.ts`; observed compiled in `dist/hast/hast-visitor.{js,d.ts}`.)

```ts
interface HastFilteredVisitor<N extends HastNode = HastNode> {
  filter: string[];
  visit(node: Readonly<N>, ctx: HastVisitorContext): HastNode | void | Promise<HastNode | void>;
}

interface HastVisitorContext {
  readonly source: string;
  readonly fileURL: URL | undefined;
  removeNode/replaceNode/insertBefore/insertAfter/wrapNode/prependChild/appendChild/setProperty(...);
  textContent(node): string;
  report(...); getDiagnostics(): HastDiagnostic[];
  // NOTE: no `parent`, no `ancestors`, no traversal-control return value.
}
```

The walk itself happens in the native binding (`walkHandle`, dispatched via `visitHastHandle` in
`src/hast/hast-visitor.ts`): Rust walks the arena in pre-order and calls the JS `visit` fn for each
node whose tag is in a subscription's `filter`. Mutations are buffered into a `CommandBuffer` and
applied afterward. The walk is **pre-order** (parents before children — see `pushChildIds` in
`src/hast/hast-reader.ts`, "reverse order for depth-first").

A `visit` can return a replacement `HastNode`, but it cannot say "don't descend into my children", and
it cannot ask "what are my ancestors". So a `code` visitor fires for **every** `<code>`, including ones
inside `<pre>`, with no way to tell them apart.

## Motivating example (and the workaround it forces downstream)

A downstream consumer (Starlight) needs the rehype behavior:

- `<pre>` → `dir="ltr"`
- inline `<code>` → `dir="auto"`
- a `<code>` **inside** a `<pre>` → left untouched (it inherits the block's `ltr`)

With `unist-util-visit` this is four lines, because hitting `pre`/`code` sets `dir` and returns `SKIP`,
so the nested `<code>` is never visited:

```ts
visit(tree, 'element', (el) => {
  if (el.tagName === 'pre' || el.tagName === 'code') {
    el.properties ||= {};
    if (!('dir' in el.properties)) el.properties.dir = { pre: 'ltr', code: 'auto' }[el.tagName];
    return SKIP; // do not descend — a <code> inside this <pre> is left alone
  }
  return CONTINUE;
});
```

On Sätteri, with no ancestry and no `SKIP`, the consumer currently has to **reconstruct ancestry from
source positions**: make the plugin a per-file factory, have the `pre` visitor record every block's
`position.start/end.offset` span, and have the `code` visitor skip any `<code>` whose span falls inside
a recorded `<pre>` span:

```ts
// Current workaround — hacky, stateful, depends on source positions existing.
function satteriRtlCodeSupportPlugin(allowedPaths) {
  return () => {                       // factory so `preSpans` resets per file
    const preSpans = [];
    return {
      name: 'starlight-rtl-code-support',
      element: [
        { filter: ['pre'], visit(node, ctx) {
            const s = nodeSpan(node); if (s) preSpans.push(s);
            if (!hasDir(node)) ctx.setProperty(node, 'dir', 'ltr');
        }},
        { filter: ['code'], visit(node, ctx) {
            if (isInsideSpan(nodeSpan(node), preSpans)) return; // ancestry-by-offset
            if (!hasDir(node)) ctx.setProperty(node, 'dir', 'auto');
        }},
      ],
      raw(node, ctx) { /* shiki path */ },
    };
  };
}
```

Problems with the workaround: it relies on `position` offsets being present (generated nodes have
none), it needs per-file mutable state, it's O(pre-count) per `<code>`, and — notably against Sätteri's
"only matched nodes cross to JS" performance goal — every nested `<code>` is still materialized and
dispatched only to be discarded.

The same shape recurs in the consumer's other Sätteri plugins (aside transform, heading autolink), so
this isn't a one-off.

## Proposal A (recommended): `SKIP` / subtree-prune return value

Let a `visit` return a traversal-control signal that the dispatcher honors. Minimum viable set, mirroring
`unist-util-visit`:

- `SKIP` — do not descend into this node's children for the remainder of this walk pass.
- `CONTINUE` — default (same as returning `void`).
- `EXIT` — stop the entire walk (nice-to-have).

Export them as symbols/consts from the package and widen the visit return type:

```ts
type VisitResult = HastNode | typeof SKIP | typeof CONTINUE | typeof EXIT | void;
// (replacement-node return keeps working; see "semantics" below)
```

The RTL plugin then collapses to a stateless near-copy of the unified version:

```ts
function satteriRtlCodeSupportPlugin(allowedPaths) {
  return {
    name: 'starlight-rtl-code-support',
    element: {
      filter: ['pre', 'code'],
      visit(node, ctx) {
        if (!shouldTransformPath(ctx.fileURL, allowedPaths)) return SKIP;
        if (!(node.properties && 'dir' in node.properties)) {
          ctx.setProperty(node, 'dir', node.tagName === 'pre' ? 'ltr' : 'auto');
        }
        return SKIP; // descend no further → a <code> inside this <pre> is left alone
      },
    },
    raw(node, ctx) { /* unchanged */ },
  };
}
```

No factory, no `preSpans`, no `position` dependency — and the nested `<code>` is **pruned**, so it never
crosses the NAPI boundary (a perf win consistent with the existing design).

### Key constraint for the implementation

`SKIP` must prune the subtree across **all subscriptions in the same walk pass**. So the two tags must be
visited in one pass — use a single combined `filter: ['pre', 'code']` visitor (one subscription) rather
than two separate `element` entries, unless the dispatcher guarantees that all of a plugin's
subscriptions share one walk and a prune from any of them prunes the others. Worth documenting either
way.

## Proposal B (companion): ancestor access on the context

Add ancestry to the context, so a visitor can inspect where it is without restructuring as a prune:

```ts
interface HastVisitorContext {
  // ...existing...
  readonly ancestors: ReadonlyArray<Readonly<Element>>; // root → parent order
  closest(tagName: string): Readonly<Element> | undefined;
  hasAncestor(tagName: string): boolean;
}
```

```ts
{ filter: ['code'], visit(node, ctx) {
    if (ctx.hasAncestor('pre')) return;        // inline code only
    if (!hasDir(node)) ctx.setProperty(node, 'dir', 'auto');
}}
```

This is the idiomatic hast/unist shape and solves the general "where am I" case (inside a blockquote, a
table cell, etc.), not just `pre`/`code`. Cost: materializing ancestor handles. The walker already
descends with an implicit ancestor stack, so exposing it is mostly plumbing; keep the handles light
(tagName/properties, not full subtrees) to avoid materializing descendants.

## Recommendation

Ship **`SKIP`** first. It's the minimal primitive that makes the boundary-stop pattern (`pre`/`code`,
and the consumer's other plugins) match their unified counterparts, and it fits the "don't materialize
what you don't need" model by pruning instead of materializing-then-discarding. Add **`ctx.ancestors` /
`closest` / `hasAncestor`** as the follow-up for cases `SKIP` can't express (where you need context but
still want to process descendants).

## Implementation notes / where to look

- `src/hast/hast-visitor.ts` — `HastFilteredVisitor`/`HastVisitorContext` types, `resolveSubscriptions`
  (flattens plugin → `{ nodeType, tagFilter, visitFn }[]`), `visitHastHandle` (drives the walk via the
  native binding, buffers `CommandBuffer` commands). The visit return value is interpreted here; this is
  where `SKIP`/`CONTINUE`/`EXIT` would be decoded and where `ctx.ancestors` would be populated.
- Native walker (`walkHandle` in the binding / Rust): for `SKIP`, the walker must invoke the JS visitor
  **during** descent and react to a prune signal by not recursing into the current node's children. For
  ancestors, it already has the descent stack — surface it (e.g. push/pop node ids and materialize
  lazily on access).
- `src/hast/hast-materializer.ts` — lazy node materialization (`materializeHastNode`, `_nodeId`); reuse
  for lazily materializing ancestor handles.
- `src/compile.ts` — `runHastPluginsOnHandle` runs each plugin's `visitHastHandle`; confirm whether all
  of a plugin's subscriptions share one pass (relevant to the `SKIP` constraint above). Plugin factories
  are already resolved per file (`typeof raw === 'function' ? raw() : raw`).

## Semantics to decide

- **Replacement + control:** today a visitor can return a replacement `HastNode`. Decide how that
  composes with `SKIP` — e.g. allow a tuple `[SKIP, replacementNode]` (as `unist-util-visit` allows
  `[SKIP, index]`), or define that returning a replacement node already implies its subtree isn't
  re-walked.
- **Async visitors:** the return type is already `T | Promise<T>`; the control signals must work through
  the async path too.
- **`EXIT` scope:** whole walk for the current plugin only (not other plugins).
- **Pre-order guarantee:** document that `SKIP` relies on parents being visited before children (already
  true).

## Tests to add

- `<pre><code>…</code></pre>`: a combined `['pre','code']` visitor returning `SKIP` sets `dir` on `<pre>`
  and never visits the nested `<code>`.
- Inline `<code>` (not under `<pre>`) is still visited.
- `EXIT` halts traversal after the current node.
- `ctx.hasAncestor('pre')` / `ctx.closest('pre')` return correctly for nested vs. top-level nodes.
- Pruned subtrees are not materialized/dispatched (assert visitor call counts).

## Prior art

`unist-util-visit` `(node, index, parents)` + `SKIP`/`CONTINUE`/`EXIT` (and `visitParents`). This request
is essentially "add back the traversal-control (and optionally ancestry) half of that contract that the
Rust-side filtering model dropped."

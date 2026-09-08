import type { APIContext } from 'astro';
import { klona } from 'klona/lite';
import { routeMiddleware } from 'virtual:starlight/route-middleware';
import type { StarlightRouteData } from './types';

/**
 * Adds a deep clone of the passed `routeData` object to locals and then runs middleware.
 * @param context Astro context object
 * @param routeData Initial route data object to attach.
 */
export async function attachRouteDataAndRunMiddleware(
	context: APIContext,
	routeData: StarlightRouteData
) {
	context.locals.starlightRoute = klona(routeData);
	const runner = new MiddlewareRunner(context, routeMiddleware);
	await runner.run();
}

type MiddlewareHandler<T> = (context: T, next: () => Promise<void>) => void | Promise<void>;

/**
 * A middleware function wrapper that only allows a single execution of the wrapped function.
 * Subsequent calls to `run()` are no-ops.
 */
class MiddlewareRunnerStep<T> {
	#callback: MiddlewareHandler<T> | null;
	constructor(callback: MiddlewareHandler<T>) {
		this.#callback = callback;
	}
	async run(context: T, next: () => Promise<void>): Promise<void> {
		if (this.#callback) {
			await this.#callback(context, next);
			this.#callback = null;
		}
	}
}

/**
 * Class that runs a stack of middleware handlers with an initial context object.
 * Middleware functions can mutate properties of the `context` object, but cannot replace it.
 *
 * @example
 * const context = { value: 10 };
 * const timesTwo = async (ctx, next) => {
 *   await next();
 *   ctx.value *= 2;
 * };
 * const addFive = async (ctx) => {
 *   ctx.value += 5;
 * }
 * const runner = new MiddlewareRunner(context, [timesTwo, addFive]);
 * runner.run();
 * console.log(context); // { value: 30 }
 */
class MiddlewareRunner<T> {
	#context: T;
	#steps: Array<MiddlewareRunnerStep<T>>;

	constructor(
		/** Context object passed as the first argument to each middleware function. */
		context: T,
		/** Array of middleware functions to run in sequence. */
		stack: Array<MiddlewareHandler<T>> = []
	) {
		this.#context = context;
		this.#steps = stack.map((callback) => new MiddlewareRunnerStep(callback));
	}

	async #stepThrough(steps: Array<MiddlewareRunnerStep<T>>) {
		let currentStep: MiddlewareRunnerStep<T>;
		while (steps.length > 0) {
			[currentStep, ...steps] = steps as [MiddlewareRunnerStep<T>, ...MiddlewareRunnerStep<T>[]];
			await currentStep.run(this.#context, async () => this.#stepThrough(steps));
		}
	}

	async run() {
		await this.#stepThrough(this.#steps);
	}
}

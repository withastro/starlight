---

title: Miljøvenlig dokumentation

description: Lær, hvordan Starlight kan hjælpe dig med at bygge grønnere dokumentationssites og reducere dit CO₂-aftryk.

---

Estimater for klimaaftrykket fra webindustrien varierer fra [2%][sf] til [4% af de globale CO₂-udledninger][bbc], hvilket omtrent svarer til udledningerne fra luftfartsindustrien. Der er mange komplekse faktorer i beregningen af den økologiske påvirkning af et websted, men denne vejledning indeholder et par tips til at reducere miljøaftrykket fra dit dokumentationssite.

Den gode nyhed er, at valget af Starlight er et godt skridt på vejen. Ifølge Website Carbon Calculator er dette site [renere end 99% af de testede websider][sl-carbon], og producerer kun 0,01g CO₂ per sidevisning.

## Sidevægt

Jo mere data en webside overfører, desto flere energiresurser kræver den. I april 2023 krævede den gennemsnitlige webside, at en bruger downloadede mere end 2.000 KB ifølge [data fra HTTP-arkivet][http].

Starlight bygger sider, der er så lette som muligt. For eksempel vil en bruger ved et første besøg downloade mindre end 50 KB komprimeret data — kun 2,5% af medianen fra HTTP-arkivet. Med en god caching-strategi kan efterfølgende navigationer downloade så lidt som 10 KB.

### Billeder

Mens Starlight leverer et godt udgangspunkt, kan billeder, du tilføjer til dine dokumentsider, hurtigt øge sidevægten. Starlight bruger Astros [optimerede assets support][assets] til at optimere lokale billeder i dine Markdown- og MDX-filer.

### UI-komponenter

Komponenter bygget med UI-rammer som React eller Vue kan let tilføje store mængder JavaScript til en side. Fordi Starlight er bygget på Astro, indlæser komponenter som disse **nul JavaScript på klientsiden som standard** takket være [Astro Islands][islands].

### Caching

Caching bruges til at kontrollere, hvor længe en browser gemmer og genbruger data, den allerede har downloadet. En god caching-strategi sikrer, at en bruger får nyt indhold så hurtigt som muligt, når det ændres, men undgår også at downloade det samme indhold unødvendigt, når det ikke er ændret.

Den mest almindelige måde at konfigurere caching på er med [`Cache-Control` HTTP-headeren][cache]. Når du bruger Starlight, kan du sætte en lang cachetid for alt i `/_astro/`-mappen. Denne mappe indeholder CSS, JavaScript og andre bundne assets, der kan caches sikkert for evigt, hvilket reducerer unødvendige downloads:

```
Cache-Control: public, max-age=604800, immutable
```

Hvordan man konfigurerer caching afhænger af din webhost. For eksempel anvender Vercel denne caching-strategi for dig uden behov for konfiguration, mens du kan sætte [tilpassede headers for Netlify][ntl-headers] ved at tilføje en `public/_headers`-fil til dit projekt:

```
/_astro/*
  Cache-Control: public
  Cache-Control: max-age=604800
  Cache-Control: immutable
```

[cache]: https://csswizardry.com/2019/03/cache-control-for-civilians/
[ntl-headers]: https://docs.netlify.com/routing/headers/

## Strømforbrug

Hvordan en webside er bygget, kan påvirke, hvor meget strøm det kræver at køre den på en brugers enhed. Ved at bruge minimalt JavaScript reducerer Starlight den mængde behandlingskraft, som en brugers telefon, tablet eller computer har brug for til at indlæse og gengive sider.

Vær opmærksom på, når du tilføjer funktioner som analytik-tracking scripts eller JavaScript-tungt indhold som videoindlejringer, da disse kan øge sideens strømforbrug. Hvis du har brug for analytik, kan du overveje at vælge en letvægtsløsning som [Cabin][cabin], [Fathom][fathom] eller [Plausible][plausible]. Indlejringer som YouTube- og Vimeo-videoer kan forbedres ved at vente med at [indlæse videoen ved brugerinteraktion][lazy-video]. Pakker som [`astro-embed`][embed] kan hjælpe med almindelige tjenester.

:::tip[Vidste du?]
Parsing og kompilering af JavaScript er en af de mest ressourcekrævende opgaver, som browsere skal udføre. Sammenlignet med at gengive et JPEG-billede af samme størrelse kan [JavaScript tage mere end 30 gange længere tid at behandle][cost-of-js].
:::

[cabin]: https://withcabin.com/
[fathom]: https://usefathom.com/
[plausible]: https://plausible.io/
[lazy-video]: https://web.dev/iframe-lazy-loading/
[embed]: https://www.npmjs.com/package/astro-embed
[cost-of-js]: https://medium.com/dev-channel/the-cost-of-javascript-84009f51e99e

## Hosting

Hvor en webside er hostet, kan have stor indflydelse på, hvor miljøvenlig din dokumentationsside er. Datacentre og serverfarme kan have en stor økologisk indflydelse, herunder højt elforbrug og intensiv brug af vand.

At vælge en host, der bruger vedvarende energi, vil betyde lavere CO₂-udledninger for dit site. [Green Web Directory][gwb] er et værktøj, der kan hjælpe dig med at finde hostingfirmaer.

[gwb]: https://www.thegreenwebfoundation.org/directory/

## Sammenligninger

Nysgerrig efter at vide, hvordan andre dokumentationsrammer klarer sig? Disse tests med [Website Carbon Calculator][wcc] sammenligner lignende sider bygget med forskellige værktøjer.

| Framework                   | CO₂ per sidevisning | Rating |
| --------------------------- | ------------------- | :----: |
| [Starlight][sl-carbon]       | 0.01g               |   A+   |
| [Read the Docs][rtd-carbon]  | 0.05g               |   A+   |
| [Sphinx][sx-carbon]          | 0.06g               |   A+   |
| [VitePress][vp-carbon]       | 0.07g               |   A+   |
| [Docus][dc-carbon]           | 0.09g               |   A+   |
| [docsify][dy-carbon]         | 0.10g               |   A    |
| [Nextra][nx-carbon]          | 0.11g               |   A    |
| [MkDocs][mk-carbon]          | 0.19g               |   B    |
| [Docusaurus][ds-carbon]      | 0.21g               |   B    |
| [GitBook][gb-carbon]         | 0.43g               |   C    |
| [Mintlify][mt-carbon]        | 1.22g               |   F    |

<small>Data indsamlet den 22. juli 2024. Klik på et link for at se opdaterede tal.</small>

[sl-carbon]: https://www.websitecarbon.com/website/starlight-astro-build-getting-started/
[vp-carbon]: https://www.websitecarbon.com/website/vitepress-dev-guide-what-is-vitepress/
[dc-carbon]: https://www.websitecarbon.com/website/docus-dev-introduction-getting-started/
[sx-carbon]: https://www.websitecarbon.com/website/sphinx-doc-org-en-master-usage-quickstart-html/
[mk-carbon]: https://www.websitecarbon.com/website/mkdocs-org-getting-started/
[nx-carbon]: https://www.websitecarbon.com/website/nextra-site-docs-docs-theme-start/
[dy-carbon]: https://www.websitecarbon.com/website/docsify-js-org/
[ds-carbon]: https://www.websitecarbon.com/website/docusaurus-io-docs/
[rtd-carbon]: https://www.websitecarbon.com/website/docs-readthedocs-io-en-stable-index-html/
[gb-carbon]: https://www.websitecarbon.com/website/docs-gitbook-com/
[mt-carbon]: https://www.websitecarbon.com/website/mintlify-com-docs-quickstart/

## Flere ressourcer

### Værktøjer

- [Website Carbon Calculator][wcc]
- [GreenFrame](https://greenframe.io/)
- [Ecograder](https://ecograder.com/)
- [WebPageTest Carbon Control](https://www.webpagetest.org/carbon-control/)
- [Ecoping](https://ecoping.earth/)

### Artikler og foredrag

- [“Building a greener web”](https://youtu.be/EfPoOt7T5lg), foredrag af Michelle Barker
- [“Sustainable Web Development Strategies Within An Organization”](https://www.smashingmagazine.com/2022/10/sustainable-web-development-strategies-organization/), artikel af Michelle Barker
- [“A sustainable web for everyone”](https://2021.stateofthebrowser.com/speakers/tom-greenwood/), foredrag af Tom Greenwood
- [“How Web Content Can Affect Power Usage”](https://webkit.org/blog/8970/how-web-content-can-affect-power-usage/), artikel af Benjamin Poulain og Simon Fraser

[sf]: https://www.sciencefocus.com/science/what-is-the-carbon-footprint-of-the-internet/
[bbc]: https://www.bbc.com/future/article/20200305-why-your-internet-habits-are-not-as-clean-as-you-think
[http]: https://httparchive.org/reports/state-of-the-web
[assets]: https://docs.astro.build/en/guides/assets/
[islands]: https://docs.astro.build/en/concepts/islands/
[wcc]: https://www.websitecarbon.com/

---
title: अवयवों को ओवरराइड करना
description: जानें कि अपनी दस्तावेज़ीकरण साइट के UI में कस्टम तत्व जोड़ने के लिए Starlight के अंतर्निहित अवयवों को कैसे ओवरराइड करें।
---

Starlight के डिफ़ॉल्ट UI और कॉन्फ़िगरेशन विकल्प लचीले होने और कंटेंट की एक श्रृंखला के लिए काम करने के लिए डिज़ाइन किए गए हैं। Starlight की अधिकांश डिफ़ॉल्ट उपस्थिति को [CSS](/hi/guides/css-and-tailwind/) और [कॉन्फ़िगरेशन विकल्पों](/hi/guides/customization/) के साथ अनुकूलित किया जा सकता है।

जब आपको बक्से के बाहर संभव से अधिक की आवश्यकता होती है, तो Starlight अपने डिफ़ॉल्ट अवयवों को विस्तारित या ओवरराइड (पूरी तरह से प्रतिस्थापित) करने के लिए अपने स्वयं के कस्टम अवयवों के निर्माण का समर्थन करता है।

## कब ओवरराइड करना चाहिए

Starlight के डिफ़ॉल्ट अवयवों को ओवरराइड करना तब उपयोगी हो सकता है जब:

- आप यह बदलना चाहते हैं कि Starlight के UI का एक हिस्सा कैसा दिखता है जो [कस्टम CSS](/hi/guides/css-and-tailwind/) के साथ संभव नहीं है।
- आप बदलना चाहते हैं कि Starlight के UI का एक हिस्सा कैसे व्यवहार करता है।
- आप Starlight के मौजूदा UI के साथ कुछ अतिरिक्त UI जोड़ना चाहते हैं।

## ओवरराइड कैसे करें

1. वह Starlight अवयव चुनें जिसे आप ओवरराइड करना चाहते हैं।
   आप [ओवरराइड्स संदर्भ](/hi/reference/overrides/) में अवयवों की पूरी सूची पा सकते हैं।

   यह उदाहरण पेज नेव बार में Starlight के [`SocialIcons`](/hi/reference/overrides/#socialicons) अवयव को ओवरराइड कर देगा।

2. Starlight अवयव को प्रतिस्थापित करने के लिए एक Astro अवयव बनाएं।
   यह उदाहरण एक संपर्क लिंक प्रस्तुत करता है.

   ```astro
   ---
   // src/components/EmailLink.astro
   import type { Props } from '@astrojs/starlight/props';
   ---

   <a href="mailto:houston@example.com">मुझे E-mail करो</a>
   ```

3. Starlight को `astro.config.mjs` में [`components`](/hi/reference/configuration/#components) कॉन्फ़िगरेशन विकल्प में अपने कस्टम अवयव का उपयोग करने के लिए कहें:

   ```js {9-12}
   // astro.config.mjs
   import { defineConfig } from 'astro/config';
   import starlight from '@astrojs/starlight';

   export default defineConfig({
     integrations: [
       starlight({
         title: 'My Docs with Overrides',
         components: {
           // डिफ़ॉल्ट `SocialIcons` अवयव को ओवरराइड करें।
           SocialIcons: './src/components/EmailLink.astro',
         },
       }),
     ],
   });
   ```

## किसी अंतर्निर्मित अवयव का पुन: उपयोग करें

आप Starlight के डिफ़ॉल्ट UI अवयवों के साथ उसी तरह निर्माण कर सकते हैं जैसे आप अपने स्वयं के साथ करते हैं: उन्हें अपने स्वयं के कस्टम अवयवों में आयात और प्रस्तुत करना। यह आपको Starlight के सभी बुनियादी UI को अपने डिज़ाइन के भीतर रखने की अनुमति देता है, और उनके साथ अतिरिक्त UI जोड़ता है।

नीचे दिया गया उदाहरण एक कस्टम अवयव दिखाता है जो डिफ़ॉल्ट `SocialIcons` अवयव के साथ एक E-mail लिंक प्रस्तुत करता है:

```astro {4,8}
---
// src/components/EmailLink.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/SocialIcons.astro';
---

<a href="mailto:houston@example.com">मुझे E-mail करो</a>
<Default {...Astro.props}><slot /></Default>
```

किसी कस्टम अवयव के अंदर अंतर्निहित अवयव को प्रस्तुत करते समय:

- इसमें `Astro.props` फैलाएं। यह सुनिश्चित करता है कि इसे वह सभी डेटा प्राप्त हो जिसे इसे प्रस्तुत करने की आवश्यकता है।
- डिफ़ॉल्ट अवयव के अंदर एक [`<slot />`](https://docs.astro.build/hi/core-concepts/astro-components/#slots) जोड़ें। यह सुनिश्चित करता है कि यदि यह अवयव किसी भी बाल तत्व को पारित करता है, तो Astro को पता रहे कि उन्हें कहां प्रस्तुत करना है।

## पेज डेटा का उपयोग करें

Starlight अवयव को ओवरराइड करते समय, आपके कस्टम कार्यान्वयन को एक मानक `Astro.props` ऑब्जेक्ट प्राप्त होता है जिसमें वर्तमान पृष्ठ के लिए सभी डेटा होता है।
यह आपको इन मूल्यों का उपयोग यह नियंत्रित करने के लिए करने की अनुमति देता है कि आपका अवयव टेम्पलेट कैसे प्रस्तुत करता है।

उदाहरण के लिए, आप पृष्ठ के फ्रंटमैटर मूल्यों को `Astro.props.entry.data` के रूप में पढ़ सकते हैं। निम्नलिखित उदाहरण में, एक प्रतिस्थापन [`PageTitle`](/hi/reference/overrides/#pagetitle) अवयव वर्तमान पृष्ठ का शीर्षक प्रदर्शित करने के लिए इसका उपयोग करता है:

```astro {5} "{title}"
---
// src/components/Title.astro
import type { Props } from '@astrojs/starlight/props';

const { title } = Astro.props.entry.data;
---

<h1 id="_top">{title}</h1>

<style>
  h1 {
    font-family: 'Comic Sans';
  }
</style>
```

[ओवरराइड्स संदर्भ](/hi/reference/overrides/#component-props) में सभी उपलब्ध प्रॉप्स के बारे में और जानें।

### केवल विशिष्ट पृष्ठों पर ही ओवरराइड करें

अवयव ओवरराइड सभी पृष्ठों पर लागू होते हैं। हालाँकि, आप अपने कस्टम UI को कब दिखाना है, Starlight के डिफ़ॉल्ट UI को कब दिखाना है, या यहां तक कि जब कुछ पूरी तरह से अलग दिखाना है, यह निर्धारित करने के लिए `Astro.props` से मूल्यों का उपयोग करके सशर्त रूप से प्रस्तुत कर सकते हैं।

निम्नलिखित उदाहरण में, Starlight के [`Footer`](/hi/reference/overrides/#footer-1) को ओवरराइड करने वाला एक अवयव केवल मुखपृष्ठ पर "Starlight 🌟 द्वारा निर्मित" प्रदर्शित करता है, और अन्यथा अन्य सभी पृष्ठों पर डिफ़ॉल्ट पाद लेख दिखाता है:

```astro
---
// src/components/ConditionalFooter.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Footer.astro';

const isHomepage = Astro.props.slug === '';
---

{
  isHomepage ? (
    <footer>Starlight 🌟 द्वारा निर्मित</footer>
  ) : (
    <Default {...Astro.props}>
      <slot />
    </Default>
  )
}
```

[Astro टेम्प्लेट सिंटैक्स मार्गदर्शिका](https://docs.astro.build/hi/core-concepts/astro-syntax/#dynamic-html) में सशर्त प्रतिपादन के बारे में अधिक जानें।

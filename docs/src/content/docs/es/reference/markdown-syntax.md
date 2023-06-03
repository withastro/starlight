---
title: Sintaxis de Markdown
description: Una descripción general de la sintaxis de Markdown que admite Starlight.
---

Starlight admite la gama completa de sintaxis de Markdown.

## Estilos en línea

El texto puede ser **negrita**, _cursiva_ o ~~tachado~~.

```md
El texto puede ser **negrita**, _cursiva_ o ~~tachado~~.
```

Puedes [enlazar a otra página](/getting-started.md).

```md
Puedes [enlazar a otra página](/getting-started.md).
```

Puedes resaltar `código en línea` con comillas invertidas.

```md
Puedes resaltar `código en línea` con comillas invertidas.
```

## Heading

Puedes estructurar el contenido usando un encabezado. Los encabezados en Markdown se indican con un número de `#` al comienzo de la línea. Aunque es compatible, generalmente debe evitar los encabezados de nivel superior y comenzar los encabezados de la página desde `<h2>` hacia abajo.

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

```md
## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

## Asides

Asides (también conocidos como “admonitions” o “callouts”) son útiles para mostrar información secundaria junto con el contenido principal de una página.

Starlight proporciona una sintaxis de Markdown personalizada para representar asides. Los bloques de aside se indican con un triple dos puntos `:::` y pueden ser de tipo `note`, `tip`, `caution` o `danger`.

Puedes anidar cualquier otro tipo de contenido de Markdown dentro de un aside, pero los asides son más adecuados para fragmentos de contenido cortos y concisos.

### Nota de aside

:::note
Starlight es un kit de herramientas de sitio web de documentación construido con [Astro](https://astro.build/). Puedes comenzar con este comando:

```sh
npm run create astro@latest --template starlight
```

:::

````md
:::note
Startlight es un kit de herramientas de sitio web de documentación construido con [Astro](https://astro.build/). Puedes comenzar con este comando:

```sh
npm run create astro@latest --template starlight
```

:::
````

### Títulos personalizados de aside

Puedes especificar un título personalizado para el aside entre corchetes cuadrados después del tipo de aside, por ejemplo, `:::tip[¿Sabías qué?]`.

:::tip[¿Sabías qué?]
Astro te ayuda a construir sitios web más rápidos con [“Arquitectura de Islas”](https://docs.astro.build/en/concepts/islands/).
:::

```md
:::tip[Did you know?]
Astro te ayuda a construir sitios web más rápidos con [“Arquitectura de Islas”](https://docs.astro.build/en/concepts/islands/).
:::
```

### Más tipos de aside

Los asides de precaución y peligro son útiles para llamar la atención de un usuario sobre detalles que pueden hacer que se tropiecen.
Si te encuentras usando estos mucho, también puede ser una señal de que lo que estás documentando podría beneficiarse de ser rediseñado.

:::caution
Si estas seguro de que quieres un sitio de documentación increíble, piensa dos veces antes de usar [Starlight](../../).
:::

:::danger
Tus usuarios pueden ser más productivos y encontrar tu producto más fácil de usar gracias a las útiles características de Starlight.

- Navegación clara
- Tema de color configurable por el usuario
- [Soporte para i18n](/guides/i18n)

:::

```md
:::caution
Si no estás seguro de que quieres un sitio de documentación increíble, piensa dos veces antes de usar [Starlight](../../).
:::

:::danger
Tus usuarios pueden ser más productivos y encontrar tu producto más fácil de usar gracias a las útiles características de Starlight.

- Navegación clara
- Tema de color configurable por el usuario
- [Soporte para i18n](/guides/i18n)

:::
```

## Citas en bloque

> Esta es una cita en bloque, que se usa comúnmente cuando se cita a otra persona o documento.
>
> Las citas en bloque se indican con un `>` al comienzo de cada línea.

```md
> Esta es una cita, que se usa comúnmente cuando se cita a otra persona o documento.
>
> Las citas se indican con un `>` al comienzo de cada línea.
```

## Bloques de código

Un bloque de código se indica con un bloque con tres comillas invertidas <code>```</code> al comienzo y al final. Puedes indicar el lenguaje de programación que se está utilizando después de las comillas invertidas de apertura.

```js
// Código Javascript con resaltado de sintaxis.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Código Javascript con resaltado de sintaxis.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
Bloques de código, largos y de una sola línea, no deben envolverse. Deben desplazarse horizontalmente si son demasiado largos. Esta línea debe ser lo suficientemente larga como para demostrar esto.
```

## Listas

Markdown admite listas desordenadas (a menudo llamadas listas de “viñetas”) y listas ordenadas, que se numeran secuencialmente.

### Aquí hay una lista desordenada:

- Artículo foo
- Artículo bar
- Artículo baz

### Y una lista ordenada:

1.  Artículo uno
1.  Artículo dos
1.  Artículo tres

### Y algunas listas anidadas

- nivel 1 artículo (ul)
  1. nivel 2 artículo (ol)
  1. nivel 2 artículo (ol)
     - nivel 3 artículo (ul)
     - nivel 3 artículo (ul)
- nivel 1 artículo (ul)
  1. nivel 2 artículo (ol)
  1. nivel 2 artículo (ol)
     - nivel 3 artículo (ul)
     - nivel 3 artículo (ul)
       1. nivel 4 artículo (ol)
       1. nivel 4 artículo (ol)
     - nivel 3 artículo (ul)
     - nivel 3 artículo (ul)
- nivel 1 artículo (ul)

### Anidando contenido mixto en listas

- Esta lista contiene muestras de código 

  ```js
  console.log('hi');
  ```

- y **otro** contenido como imágenes:
  ![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

- o citas en bloque

  > to dent
  > para 

- Pero el estilo en línea como **negrita**, _cursiva_, `código` o ~~tachado~~, no cambia el espaciado vertical.

- ¿Correcto?

## Tablas 

Tablas de Markdown soportan alineación horizontal.

| encabezado 1        |     encabezado 2      | tres |
| :----------- | :---------------: | ----: |
| ok           | buen pescado sueco |  agradable |
| agotado |  bueno y abundante  |  agradable |
| ok           |   buenas `oreos`    |   hmm |
| ok           | buen `zoute` drop |  yumm |

```md
| encabezado 1        |     encabezado 2      | tres |
| :----------- | :---------------: | ----: |
| ok           | buen pescado sueco |  agradable |
| agotado |  bueno y abundante  |  agradable |
| ok           |   buenas `oreos`    |   hmm |
| ok           | buen `zoute` drop |  yumm |
```

## Reglas horizontales

Markdown admite la representación de una regla horizontal (un elemento `<hr>`) con una sintaxis de triple guión: `---`.

---

```md
---
```

## Listas de definición

Mientras que Markdown no proporciona una sintaxis personalizada para las listas de definición, aún puedes escribirlas usando los elementos HTML estándar `<dl>`, `<dt>` y `<dd>`:

<dl>
  <dt>Nombre</dt>
  <dd>Godzilla</dd>
  <dt>Nacido</dt>
  <dd>1952</dd>
  <dt>Término 1</dt>
  <dt>Término 2</dt>
  <dd>Segunda descripción de Término 1 y Término 2, posiblemente más de una línea</dd>
  <dd>Segunda descripción de Término 1 y Término 2, posiblemente más de una línea</dd>
</dl>

## Imágenes

### Imagen pequeña

![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

```md
![VuePress logo](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)
```

### Imagen grande

![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![An illustration of planets and stars featuring the word “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

## Pruebas de marcado misceláneo

### Prueba de enlaces largos

[Este es un enlace muy largo que se envuelve y, por lo tanto, no se desborda
aún cuando viene al principio de la línea](.) de la línea.

- [Este es un enlace muy largo que se envuelve y, por lo tanto, no se desborda
  cuando es usado primero en un artículo](.) en una lista.

### ¡Supercalifragilisticexpialidocious!

Asegurándose de que este título con una palabra muy larga en envuelva en lugar de desbordamiento en pantallas pequeñas.


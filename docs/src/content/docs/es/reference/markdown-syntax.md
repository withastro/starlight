---
title: Sintaxis de Markdown
description: Una visión general de la sintaxis Markdown que Starlight admite.
---

Starlight admite la gama completa de sintaxis de Markdown.

## Estilos en línea

El texto puede estar **en negrita**, _en cursiva_, o ~~tachado~~.

```md
El texto puede estar **en negrita**, _en cursiva_, o ~~tachado~~.
```

Puedes [enlazar a otra página](/getting-started.md).

```md
Puedes [enlazar a otra página](/getting-started.md).
```

Puedes resaltar `código en línea` con comillas invertidas.

```md
Puedes resaltar `código en línea` con comillas invertidas.
```

## Encabezados

Puedes estructurar el contenido utilizando encabezados. Los encabezados en Markdown se indican con uno o más `#` al inicio de la línea. Aunque es compatible, generalmente se recomienda evitar los encabezados de nivel superior y comenzar los encabezados en la página desde `<h2>` en adelante.

## Encabezado 2

### Encabezado 3

#### Encabezado 4

##### Encabezado 5

###### Encabezado 6

```md
## Encabezado 2

### Encabezado 3

#### Encabezado 4

##### Encabezado 5

###### Encabezado 6
```

## Asides

Los asides (también conocidos como “admoniciones” o ”callouts”) son útiles para mostrar información secundaria junto al contenido principal de una página.

Starlight proporciona una sintaxis personalizada de Markdown para renderizar asides. Los bloques de asides se indican utilizando tres dos puntos `:::` y pueden ser de tipo `note`, `tip`, `caution` o `danger`.

Puedes anidar cualquier otro tipo de contenido Markdown dentro de un aside, pero los asides son más adecuados para fragmentos de contenido cortos y concisos.

### Nota aside

:::note
Starlight es un conjunto de herramientas para crear sitios web de documentación construido con [Astro](https://astro.build/). Puedes comenzar con este comando:

```sh
npm run create astro@latest --template starlight
```

:::

````md
:::note
Starlight es un conjunto de herramientas para sitios de documentación construido con [Astro](https://astro.build/). Puedes comenzar con este comando:

```sh
npm run create astro@latest --template starlight
```

:::
````

### Títulos personalizados para los asides

Puedes especificar un título personalizado para el aside utilizando corchetes cuadrados después del tipo del aside, por ejemplo, `:::tip[¿Sabías esto?]`.

:::tip[¿Sabías esto?]
Astro te ayuda a construir sitios web más rápidos con la[“Arquitectura de Islas”](https://docs.astro.build/es/concepts/islands/).
:::

```md
:::tip[¿Sabías esto?]
Astro te ayuda a construir sitios web más rápidos con la[“Arquitectura de Islas”](https://docs.astro.build/es/concepts/islands/).
:::
```

### Más tipos de asides

Los asides de caution y danger son útiles para llamar la atención del usuario sobre detalles que podrían generar problemas. Si te encuentras utilizando estos tipos de asides con frecuencia, también puede ser una señal de que lo que estás documentando podría beneficiarse de una reestructuración o rediseño.

:::caution
Si no estás seguro de si deseas un sitio de documentación increíble, piénsalo dos veces antes de usar [Starlight](../../).
:::

:::danger
Tus usuarios pueden ser más productivos y encontrar más fácil de usar tu producto gracias a las útiles características de Starlight.

- Navegación clara
- Tema de color configurable por el usuario
- [Soporte de i18n](/guides/i18n)

:::

```md
:::caution
Si no estás seguro de si deseas un sitio de documentación increíble, piénsalo dos veces antes de usar [Starlight](../../).
:::

:::danger
Tus usuarios pueden ser más productivos y encontrar más fácil de usar tu producto gracias a las útiles características de Starlight.

- Navegación clara
- Tema de color configurable por el usuario
- [Soporte de i18n](/guides/i18n)

:::
```

## Citas en bloque

> Esto es una cita en bloque, que se utiliza comúnmente para citar a otra persona o documento.
>
> Las citas en bloque se indican con un `>` al inicio de cada línea.

```md
> Esto es una cita en bloque, que se utiliza comúnmente para citar a otra persona o documento.
>
> Las citas en bloque se indican con un `>` al inicio de cada línea.
```

## Bloques de código

Un bloque de código se indica con un bloque de tres comillas invertidas <code>```</code> al inicio y al final. Puedes indicar el lenguaje de programación que se está utilizando después de las comillas invertidas de apertura.

```js
// Código JavaScript con resaltado de sintaxis.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```

````md
```js
// Código JavaScript con resaltado de sintaxis.
var fun = function lang(l) {
  dateformat.i18n = require('./lang/' + l);
  return true;
};
```
````

```md
Los bloques de código largos de una sola línea no deben ajustarse automáticamente. Deben desplazarse horizontalmente si son demasiado largos. Esta línea debe ser lo suficientemente larga para demostrar esto.
```

## Listas

Markdown admite listas desordenadas (a menudo llamadas listas de “puntos”) y listas ordenadas, que están numeradas secuencialmente.

### Aquí tienes una lista desordenada:

- Elemento foo
- Elemento bar
- Elemento baz

### Y una lista ordenada:

1.  Elemento uno
1.  Elemento dos
1.  Elemento tres

### 
Y algunas listas anidadas
- Elemento de nivel 1 (ul)
  1. Elemento de nivel 2 (ol)
  2. Elemento de nivel 2 (ol)
     - Elemento de nivel 3 (ul)
     - Elemento de nivel 3 (ul)
- Elemento de nivel 1 (ul)
  1. Elemento de nivel 2 (ol)
  2. Elemento de nivel 2 (ol)
     - Elemento de nivel 3 (ul)
     - Elemento de nivel 3 (ul)
       1. Elemento de nivel 4 (ol)
       2. Elemento de nivel 4 (ol)
     - Elemento de nivel 3 (ul)
     - Elemento de nivel 3 (ul)
- Elemento de nivel 1 (ul)

### Anidar contenido mixto en listas

- Esta lista contiene ejemplos de código

  ```js
  console.log('hi');
  ```

- Y **otro** contenido como imágenes:
  ![Logo de VuePress](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

- o citas en bloque

  > para identar

- Pero los estilos en línea como **negrita**, _cursiva_, `código`, o ~~tachado~~, no cambian el espaciado vertical.

- ¿Cierto?

## Tablas

Las tablas Markdown admiten la alineación horizontal.

| head1        |     head dos          | tres  |
| :----------- | :-------------------: | ----: |
| ok           |  buen pescado sueco   |  bien |
| agotado      |  bueno y abundante    |  bien |
| ok           |   buenos `oreos`      |   hmm |
| ok           | buena gota de `zoute` |  yumm |

```md
| head1        |     head dos          | tres  |
| :----------- | :-------------------: | ----: |
| ok           |  buen pescado sueco   |  bien |
| agotado      |  bueno y abundante    |  bien |
| ok           |   buenos `oreos`      |   hmm |
| ok           | buena gota de `zoute` |  yumm |
```

## Líneas horizontales

Markdown admite representar una línea horizontal (un elemento `<hr>`) utilizando una sintaxis de triple guion: `---`.

---

```md
---
```

## Listas de definición

Si bien Markdown no proporciona una sintaxis personalizada para listas de definiciones, aún puedes escribirlas utilizando los elementos HTML estándar `<dl>`, `<dt>` y `<dd>`:

<dl>
  <dt>Nombre</dt>
  <dd>Godzilla</dd>
  <dt>Nacido</dt>
  <dd>1952</dd>
  <dt>Término 1</dt>
  <dt>Término 2</dt>
  <dd>Primera descripción de Término1 y Término2, posiblemente en más de una línea</dd>
  <dd>Segunda descripción de Término1 y Término2, posiblemente en más de una línea</dd>
</dl>

## Imágenes

### Imagen pequeña

![Logo de VuePress](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)

```md
![Logo de VuePress](https://raw.githubusercontent.com/withastro/docs/main/public/logos/vuepress.png)
```

### Imagen grande

![Una ilustración de planetas y estrellas con la palabra “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)

```md
![Una ilustración de planetas y estrellas con la palabra “astro”](https://raw.githubusercontent.com/withastro/docs/main/public/default-og-image.png)
```

## Pruebas de marcado variadas

### Prueba de enlaces largos

[Este es un enlace muy largo que se ajusta automáticamente y, por lo tanto, no desborda incluso cuando está al principio](.) de la línea.

- [Este es un enlace muy largo que se ajusta automáticamente y, por lo tanto, no desborda la línea cuando se utiliza primero en un elemento](.) en una lista.

### ¡Supercalifragilisticoespialidoso!

Asegurándose de que este encabezado con una palabra muy larga se ajuste automáticamente en lugar de desbordarse en pantallas pequeñas.

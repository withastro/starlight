declare namespace App {
	type StarlightLocals = import('@astrojs/starlight').StarlightLocals;
	interface Locals extends StarlightLocals {}
}

declare namespace StarlightApp {
	type Translations = typeof import('./translations').Translations.en;
	interface I18n extends Translations {}
}

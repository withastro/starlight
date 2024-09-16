declare namespace StarlightApp {
	interface I18n {}
}

declare namespace App {
	interface Locals {
		t: import('./utils/createTranslationSystem').I18nT;
	}
}

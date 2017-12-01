import {JetApp, JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			type: "space",
			rows: [
				{template: _("Settings"), type: "header"},
				{name: "lang",
					optionWidth: 120,
					view: "segmented",
					label: _("Language"),
					options: [
						{id: "en", value: "English"},
						{id: "ru", value: "Russian"}
					],
					click: () => this.toggleLanguage(),
					value: lang},
				{}
			]
		};
	}
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({name: "lang"}).getValue();
		langs.setLang(value);
	}
}

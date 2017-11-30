import {JetView} from "webix-jet";

export default class DataViewSettings extends JetView {
	config() {
		let language = {
			view: "select",
			label: "language",
			width: 400,
			css: "language",
			value: 1,
			options: [
				{value: "English"},
				{value: "Russian"}
			]
		};

		// let en = {
		// 	view: "button",
		// 	value: "en-US",
		// 	id: " button-en",
		// 	on: {
		// 		onClick() {
		// 			$$("button-en").switchLocale(this.value);
		// 		}
		// 	}
		// };

		// function switchLocale(locale) {
		// 	webix.i18n.setLocale(locale);
		// 	recreate_grid();
		// }

		let lay = {cols: [{rows: [language, {}]}, {}]};
		return lay;
	}
}

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

		let lay = {cols: [{rows: [language, {}]}, {}]};
		return lay;
	}
}

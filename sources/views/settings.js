import {JetView} from "webix-jet";

export default class DataViewSettings extends JetView{
	config(){

    var language = {
      view: "select",
			label: "language",
			width: 400, css: "language",
      value:1, options: [
        { value: "English"},
        { value: "Russian"}
      ]
    };

		var en = {
			view: "button",
			value: "en-US",
			id:" button-en",
			on: {
				onClick: function() {
					$$("button-en").switchLocale(this.value)
				}
			}
		};

		function switchLocale(locale) {
			webix.i18n.setLocale(locale);
			recreate_grid();
		}

    var lay = {cols: [{rows:[language,{}]}, {}]};
    return lay;
  }

}

import {JetView} from "webix-jet";
import {activitytypes, setActivityTypes} from "models/activitytypes";
import {setStatuses} from "models/statuses";


export default class ViewActivityForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{view: "richselect",
					label: _("Value"),
					name: "Value",
					options: {
						data: activitytypes,
						body: {template: "#Value#"}
					}},
				{view: "richselect",
					label: _("Icon"),
					name: "Icon",
					options: {
						data: activitytypes,
						body: {
							template: "#Icon#"
						}
					}},
				{view: "checkbox", label: _("Complited"), name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", id: "btnAddActivity", value: _("Add"), click() { this.$scope.saveData(); }},
					{view: "button", value: _("cancel"), click() { this.$scope.hideWindow(); }}
				]}
			],
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		const windowPopUp = {
			view: "window",
			id: "activityPopUp",
			position: "center",
			modal: true,
			head: _("Add"),
			body: form
		};

		return windowPopUp;
	}
	showWindow(id) {
		this.getRoot().show();
		const btnAdd = $$("btnAddActivity");
		const window = $$("activityPopUp");
		if (id) {
			this.getRoot().queryView({view: "form"}).setValues(activitytypes.getItem(id));
			btnAdd.define("label", "edit");
			window.define("label", "edit");
		}
		else {
			btnAdd.define("label", _("add"));
			window.define("label", "add");
		}
		btnAdd.refresh();
		// window.refresh();
	}
	hideWindow() {
		this.getRoot().queryView({view: "form"}).clear();
		this.getRoot().queryView({view: "form"}).clearValidation();
		this.getRoot().hide();
	}
	saveData() {
		if (this.getRoot().getBody().validate()) {
			const types = this.getRoot().getBody().getValues();
			setActivityTypes(types.id, types);
			this.hideWindow();
		}
	}
}

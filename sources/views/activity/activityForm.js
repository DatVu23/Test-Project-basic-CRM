import {JetView} from "webix-jet";
import {activitytypes, setActivityTypes} from "models/activitytypes";
import {setStatuses} from "models/statuses";


export default class ViewActivityForm extends JetView {
	config() {
		const form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{view: "richselect",
					label: "Value",
					name: "Value",
					options: {
						data: activitytypes,
						body: {template: "#Value#"}
					}},
				{view: "richselect",
					label: "Icon",
					name: "Icon",
					options: {
						data: activitytypes,
						body: {
							template: "#Icon#"
						}
					}},
				{view: "checkbox", label: "Complited", name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", id: "btnAddActivity", value: "Add", click() { this.$scope.saveData(); }},
					{view: "button", value: "cancel", click() { this.$scope.hideWindow(); }}
				]}
			],
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		const windowPopUp = {
			view: "window",
			position: "center",
			modal: true,
			head: "Add(*edit)",
			body: form
		};

		return windowPopUp;
	}
	showWindow(id) {
		this.getRoot().show();
		if (id) {
			this.getRoot().queryView({view: "form"}).setValues(activitytypes.getItem(id));
			const btnAdd = $$("btnAddActivity");
			btnAdd.define("label", "edit");
			btnAdd.refresh();
		}
		else {
			const btnAdd = $$("btnAddActivity");
			btnAdd.define("label", "add");
			btnAdd.refresh();
		}
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

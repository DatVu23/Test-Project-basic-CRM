import {JetView} from "webix-jet";
import {activitytypes, setActivityTypes} from "models/activitytypes";
import {statuses, setStatuses} from "models/statuses";
import {users, setUsers} from "models/users";


export default class ViewStatusesForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{
					view: "textarea",
					label: _("Name"),
					name: "Value"
				},
				{
					view: "textarea",
					label: _("Icon"),
					name: "Icon"
				},
				{view: "checkbox", label: _("Complited"), name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", id: "btnAddStatus", value: _("Add"), click() { this.$scope.saveData(); }},
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
			position: "center",
			modal: true,
			head: _("Add"),
			body: form
		};

		return windowPopUp;
	}
	showWindow(id) {
		this.getRoot().show();
		if (id) {
			this.getRoot().queryView({view: "form"}).setValues(statuses.getItem(id));
			const btnAdd = $$("btnAddStatus");
			btnAdd.define("label", "edit");
			btnAdd.refresh();
		}
		else {
			const btnAdd = $$("btnAddStatus");
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
			setStatuses(types.id, types);
			this.hideWindow();
		}
	}
}

import {JetView} from "webix-jet";
import {users} from "models/users";
import {activities, setActivities, getActivity} from "models/activities";
import {activitytypes} from "models/activitytypes";


export default class ViewActivityForm extends JetView {
	config() {
		const form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{view: "textarea", label: "Details", name: "Details"},
				{view: "richselect",
					label: "Type",
					name: "TypeID",
					options: {
						data: activitytypes,
						body: {template: "#Value#"}
					}},
				{view: "richselect",
					label: "Contacts",
					name: "ContactID",
					options: {
						data: users,
						body: {
							template: "#FirstName# #LastName# #Email#"
						}
					}},
				{view: "datepicker", name: "DueDate", label: "Date", format: "%d-%m-%Y", stringResult: true},
				{view: "checkbox", label: "Complited", name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", id: "btnWindow", value: "Add(Save)", click() { this.$scope.saveData(); }},
					{view: "button", value: "cancel", click() { this.$scope.hideWindow(); }}
				]}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};

		const windowPopUp = {
			view: "window",
			position: "center",
			modal: true,
			head: "Add(*edit)activity",
			body: form
		};

		return windowPopUp;
	}
	showWindow(id, param) {
		this.getRoot().show();
		if (id && param) {
			this.getRoot().queryView({view: "form"}).elements.ContactID.setValue(id);
			const btnAdd = $$("btnWindow");
			btnAdd.define("label", "add");
			btnAdd.refresh();
		}
		else if (id) {
			this.getRoot().queryView({view: "form"}).setValues(activities.getItem(id));
			const btnAdd = $$("btnWindow");
			btnAdd.define("label", "edit");
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
			const loadData = this.getRoot().getBody().getValues();
			setActivities(loadData.id, loadData);
			this.hideWindow();
		}
	}
}

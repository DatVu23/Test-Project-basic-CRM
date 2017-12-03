import {JetView} from "webix-jet";
import {users} from "models/users";
import {activities, setActivities, getActivity} from "models/activities";
import {activitytypes} from "models/activitytypes";


export default class ViewActivityForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{view: "textarea", label: _("Details"), name: "Details"},
				{view: "richselect",
					label: _("Type"),
					name: "TypeID",
					options: {
						data: activitytypes,
						body: {template: "#Value#"}
					}},
				{view: "richselect",
					label: _("Contacts"),
					name: "ContactID",
					options: {
						data: users,
						body: {
							template: "#FirstName# #LastName# #Email#"
						}
					}},
				{view: "datepicker", name: "DueDate", label: _("date"), format: "%d-%m-%Y", timepicker: false, stringResult: true},
				{view: "checkbox", label: _("Complited"), name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", name: "btnWindow", value: _("Add"), click() { this.$scope.saveData(); }},
					{view: "button", value: _("cancel"), click() { this.$scope.hideWindow(); }}
				]}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};

		const windowPopUp = {
			view: "window",
			name: "window",
			position: "center",
			modal: true,
			head: _("Add activity"),
			body: form
		};

		return windowPopUp;
	}
	showWindow(id, param) {
		this.getRoot().show();
		const btnAdd = this.getRoot().queryView({name: "btnWindow"});
		const window = this.getRoot().queryView({name: "window"});
		const contactID = this.getRoot().queryView({name: "ContactID"});
		if (id && param) {
			this.getRoot().queryView({view: "form"}).elements.ContactID.setValue(id);
			contactID.disable();
			btnAdd.define("label", "add");
			// window.define("head", "add");
		}
		else if (id) {
			this.getRoot().queryView({view: "form"}).setValues(activities.getItem(id));
			contactID.disable();
			btnAdd.define("label", "edit");
			// window.define("head", "edit");
		}
		btnAdd.refresh();
		window.refresh();
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

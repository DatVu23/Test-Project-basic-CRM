import {JetView} from "webix-jet";
import {users, getUser, getUsers} from "models/users";
import {getActivities, setActivities, getActivity} from "models/activities";
import {getActivitytypes, getTypes} from "models/activitytypes";


export default class ViewActivityForm extends JetView {
	config() {
		let form = {
			view: "form",
			borderless: true,
			width: 400,
			elements: [
				{view: "textarea", label: "Details", name: "Details"},
				{view: "richselect",
					label: "Type",
					name: "TypeID",
					options: {
						data: getTypes(),
						body: {template: "#Value#"}
					}},
				{view: "richselect",
					label: "Contacts",
					name: "ContactID",
					options: {
						data: getUser(),
						body: {
							template: "#FirstName# #LastName# #Email#"
						}
					}},
				{view: "datepicker", name: "DueDate", label: "Date", format: "%d-%m-%Y", stringResult: true},
				{view: "checkbox", label: "Complited", name: "State", checkValue: "Close", unCheckValue: "Open"},
				{cols: [
					{view: "button", value: "Add(Save)", click() { this.$scope.saveData(); }},
					{view: "button", value: "cancel", click() { this.$scope.hideWindow(); }}
				]}
			],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
		};

		let windowPopUp = {
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
		}
		else if (id) {
			this.getRoot().queryView({view: "form"}).setValues(getActivity(id));
		}
	}
	hideWindow() {
		this.getRoot().hide();
	}
	saveData() {
		if (this.getRoot().getBody().validate()) {
			const loadData = this.getRoot().getBody().getValues();
			setActivities(loadData.id, loadData);
			this.getRoot().hide();
		}
	}
}

import {JetView} from "webix-jet";
import {users, setUsers} from "models/users";
import {statuses} from "models/statuses";

export default class ContactForm extends JetView {
	config() {
		const userForm = {
			view: "form",
			borderless: true,
			elements: [
				{cols: [
					{rows: [
						{view: "text", label: "First Name", name: "FirstName"},
						{view: "text", label: "Last Name", name: "LastName"},
						{view: "datepicker", label: "Joining date", name: "StartDate", format: "%d-%m-%Y", stringResult: true},
						{view: "richselect",
							label: "Status",
							name: "StatusID",
							options: {
								data: statuses,
								body: {
									template: "#Icon#"
								}
							}
						},
						{view: "text", label: "Job", name: "Job"},
						{view: "text", label: "Company", name: "Company"},
						{view: "text", label: "Website", name: "Website"},
						{view: "text", label: "Address", name: "Address"}
					]},
					{rows: [
						{view: "text", label: "Email", name: "Email"},
						{view: "text", label: "Skype", name: "Skype"},
						{view: "text", label: "Phone", name: "Phone"},
						{view: "datepicker", label: "Birthday", name: "Birthday", format: "%d-%m-%Y", stringResult: true},
						{template: function userinfo(user) {
							let photo = "<img src='/sources/images/mail.png'; class='box'>";
							if (user.Photo) {
								photo = `<img src='${user.Photo}'; class='box'>;`;
							}
							return photo;
						},
						height: 400
						}
					]}
				]},
				{},
				{cols: [
					{},
					{
						view: "button",
						type: "iconButton",
						icon: "close",
						css: "webix_icon user_button",
						autowidth: true,
						label: "Cancel",
						click() {
							let id = users.getCursor();
							this.$scope.show(`contacts.contacttemplate?id=${id}`);
						}
					},
					{
						view: "button",
						id: "btnAddContact",
						type: "iconButton",
						icon: "plus",
						css: "webix_icon user_button",
						autowidth: true,
						label: "Add",
						click: () => {
							this.getRoot().queryView({view: "button"}).define("label", "Edit");
							this.getRoot().queryView({view: "button"}).refresh();
							this.saveContact();
						}
					}
				]}
			],
			elementsConfig: {
				margin: 20,
				labelWidth: 100
			},
			rules: {
				StatusID: webix.rules.isNotEmpty
			}
		};
		return {rows: [userForm, {borderless: true}]};
	}
	urlChange(view, url) {
		if (url[0].params.id) {
			const btnAdd = $$("btnAddContact");
			btnAdd.define("label", "edit");
			btnAdd.refresh();
			let id = url[0].params.id;
			if (id) {
				this.getRoot().queryView({view: "form"}).setValues(users.getItem(id));
			}
		}
	}
	saveContact() {
		if (this.getRoot().queryView({view: "form"}).validate()) {
			webix.message("Data entered correctly");
			const saveData = this.getRoot().queryView({view: "form"}).getValues();
			setUsers(saveData.id, saveData);
			let id = saveData.id || users.getLastId();
			if (id === users.getLastId()) {
				$$("contactlist").select(id);
			}
			else {
				this.show(`contacts.contactform?id=${id}`);
			}
		}
	}
}

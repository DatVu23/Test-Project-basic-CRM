import {JetView} from "webix-jet";
import {users, setUsers} from "models/users";
import {statuses} from "models/statuses";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const buttonCancel = {
			view: "button",
			type: "iconButton",
			icon: "close",
			css: "webix_icon user_button",
			autowidth: true,
			label: _("cancel"),
			click() {
				let id = users.getCursor();
				this.$scope.show(`contacts.contacttemplate?id=${id}`);
			}
		};

		const buttonAdd = {
			view: "button",
			id: "btnAddContact",
			type: "iconButton",
			icon: "plus",
			css: "webix_icon user_button",
			autowidth: true,
			label: _("Add"),
			click: () => {
				this.getRoot().queryView({view: "button"}).define("label", "Edit");
				this.getRoot().queryView({view: "button"}).refresh();
				this.saveContact();
			}
		};

		const userForm = {
			view: "form",
			borderless: true,
			elements: [
				{cols: [
					{rows: [
						{view: "text", label: _("First Name"), name: "FirstName"},
						{view: "text", label: _("Last Name"), name: "LastName"},
						{view: "datepicker", label: _("Joining date"), name: "StartDate", format: "%d-%m-%Y", stringResult: true},
						{view: "richselect",
							label: _("Status"),
							name: "StatusID",
							options: {
								data: statuses,
								body: {
									template: "#Icon#"
								}
							}
						},
						{view: "text", label: _("Job"), name: "Job"},
						{view: "text", label: _("Company"), name: "Company"},
						{view: "text", label: _("Website"), name: "Website"},
						{view: "text", label: _("Address"), name: "Address"}
					]},
					{rows: [
						{view: "text", label: _("Email"), name: "Email"},
						{view: "text", label: _("Skype"), name: "Skype"},
						{view: "text", label: _("Phone"), name: "Phone"},
						{view: "datepicker", label: _("Birthday"), name: "Birthday", format: webix.i18n.dateFormatStr, stringResult: true},
						{template: function userinfo(user) {
							let photo = "<img src='/sources/images/mail.png'; class='box'>";
							if (user.Photo) {
								photo = `<img src='${user.Photo}'; class='box'>;`;
							}
							return photo;
						},
						minheight: 400
						}
					]}
				]},
				{},
				{cols: [
					{},
					buttonCancel,
					buttonAdd
				]}
			],
			elementsConfig: {
				margin: 20,
				labelWidth: 150
			},
			rules: {
				StatusID: webix.rules.isNotEmpty,
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty
			}
		};
		return {rows: [userForm, {borderless: true}]};
	}
	init() {
		this.app.attachEvent("editButton", () => {
			let btn = this.getRoot().queryView({view: "button"});
			btn.define("label", _("edit"));
			btn.refresh();
		});
	}
	urlChange(view, url) {
		if (url[0].params.id) {
			const btnAdd = $$("btnAddContact");
			btnAdd.define("label", _("edit"));
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

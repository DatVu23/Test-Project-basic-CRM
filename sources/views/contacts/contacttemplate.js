import {JetView} from "webix-jet";
import {users} from "models/users";
import {statuses} from "models/statuses";
import TabView from "views/contacts/tabview";
import ViewActivityForm from "views/contacts/formwindow";

export default class DataViewTemplate extends JetView {
	config() {
		const userTemplate = {
			view: "template",
			borderless: true,
			id: "userTemplate",
			autoheight: true,
			template: function userinfo(user) {
				let username = "<h1 class='top-name'>Name Surname</h1>";
				let photo = "<img src='/sources/images/mail.png'; class='box'>";
				let email = "<div class='info_of_user'><span class ='icons webix_icon fa-envelope'></span>Email<br>";
				let skype = "<span class ='icons webix_icon fa-skype icon_user'></span>Skype<br>";
				let job = "<span class ='icons webix_icon fa-tag'></span>Job<br>";
				let company = "<span class ='icons webix_icon fa-briefcase'></span>Company</div>";
				let birthday = "<div class='info_user'><span class ='icons webix_icon fa-calendar'></span>Birthday<br>";
				let location = "<span class ='icons webix_icon fa-map-marker'></span>Location<br></div>";

				if (user.FirstName) {
					username = `"<h1 class='top-name'>${user.FirstName} ${user.LastName}</h1>"`;
				}
				if (user.Photo) {
					photo = `<img src='${user.Photo}'; class='box'>;`;
				}
				if (user.Email) {
					email = `<div class='info_of_user'><span class ='icons webix_icon fa-envelope'></span>${user.Email}<br>`;
				}
				if (user.Skype) {
					skype = `<span class ='icons webix_icon fa-skype icon_user'></span>${user.Skype}<br>`;
				}
				if (user.Job) {
					job = `<span class ='icons webix_icon fa-tag'></span>${user.Job}<br>`;
				}
				if (user.Company) {
					company = `<span class ='icons webix_icon fa-briefcase'></span>${user.Company}</div>`;
				}
				if (user.Birthday) {
					birthday = `<div class='info_user'><span class ='icons webix_icon fa-calendar'></span>${user.Birthday}<br>`;
				}

				let info = username + photo +
      email + skype + job + company + birthday + location;

				return info;
			}
		};

		let status = {
			view: "template", css: "statustempl", autoheight: true, borderless: true, id: "statusValue", template(item) { return `${item.id}`; }
		};


		const buttonRemove = {
			view: "button",
			type: "icon",
			icon: "trash",
			label: "delete",
			autoheight: true,
			autowidth: true,
			click: () => {
				webix.confirm({
					text: "Do you wanna delete this User? <br/> Are you sure?",
					ok: "Yes",
					cancel: "Cancel",
					callback: (res) => {
						if (res) {
							let id = users.getCursor();
							users.remove(id);
							id = users.getFirstId();
							this.show(`contacts.contacttemplate?id=${id}`);
						}
					}
				});
			}

		};

		const buttonEdit = {
			id: "btnedit",
			view: "button",
			label: "edit",
			type: "icon",
			icon: "edit",
			autoheight: true,
			autowidth: true,
			click: () => {
				let id = users.getCursor();
				this.app.callEvent("editButton", []);
				this.show(`contacts.contactform?id=${id}`);
			}
		};

		const layout = {
			rows: [
				{cols: [
					{rows: [userTemplate, status]},
					{rows: [buttonRemove, {}]},
					{rows: [buttonEdit, {}]}
				]
				}, TabView]
		};
		return layout;
	}
	init() {
		this.ViewActivityForm = this.ui(ViewActivityForm);
	}
	urlChange(view, url) {
		if (url[0].params.id) {
			const id = url[0].params.id;
			const usersData = users.waitData;
			const statusesData = statuses.waitData;
			webix.promise.all([usersData, statusesData]).then(function () {
				let user = users.getItem(id);
				view.queryView({id: "userTemplate"}).parse(user);
				view.queryView({id: "statusValue"}).parse(statuses.getItem(user.StatusID));
			});
		}
	}
}

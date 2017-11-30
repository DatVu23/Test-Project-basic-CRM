import {JetView} from "webix-jet";
import {getUsers, setUsers} from "models/users";
import {statuses} from "models/status";

export default class DataViewTemplate extends JetView {
	config() {
		let userTemplate = {
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
				let status = "<p class='status'>Status</p>";

				if (user.FirstName) {
					username = `<h1 class='top-name'>${user.FirstName} ${user.LastName}</h1>`;
				}
				if (user.Photo) {
					photo = "<img src='/sources/images/mail.png'; class='box'>";
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
				if (user.id) {
					status = `<p class='status'>${user.Status}</p>`;
				}

				let info = username + photo +
      email + skype + job + company + birthday + location + status;

				return info;
			}
		};
		return userTemplate;
	}
	init() {
		this.on(this.app, "contactinfo", (id) => {
			let contact = getUsers(id);
			statuses.waitData.then(function () {
				let obj = statuses.getItem(contact.StatusID + 1);
				contact.Status = obj.Value;
				$$("userTemplate").parse(contact);
			});
		});
	}
}

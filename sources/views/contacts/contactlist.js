import {JetView} from "webix-jet";
import {users} from "models/users";

export default class DataViewContact extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const filter = {
			view: "text", id: "filterlist", label: _("Filter"), labelWidth: 80
		};

		const menu = {
			view: "list",
			id: "contactlist",
			width: 480,
			select: true,
			template: "<img src='#Photo#'> #FirstName# #LastName# <br> #Email#",
			scroll: true,
			type: {
				height: 70,
				css: "webix_icon fa-users"
			},
			on: {
				onAfterSelect: (id) => {
					users.setCursor(id);
					this.show(`contacts.contacttemplate?id=${id}`);
					// $$("filterlist").filter("");
				}
			}
		};

		const container = {
			rows: [
				{view: "toolbar",
					elements: [
						filter
					]
				},
				menu
			]
		};

		const buttonAdd = {
			id: "btn",
			view: "button",
			type: "icon",
			icon: "plus",
			label: _("Add contact"),
			autowidth: true,
			click: () => {
				let btn = this.getRoot().queryView({view: "button"});
				btn.define("label", "Add");
				btn.refresh();
				this.show("contacts.contactform");
			}
		};


		const lay = {
			rows: [container, buttonAdd]
		};

		return lay;
	}
	init(view, url) {
		let list = view.queryView({view: "list"});
		list.parse(users);
		users.waitData.then(function () {
			let id = list.getFirstId();
			if (url[1] && url[1].params.id) {
				id = url[1].params.id;
			}
			list.select(id);
		});
		$$("filterlist").attachEvent("onTimedKeyPress", function () {
			let value = this.getValue().toLowerCase();
			$$("contactlist").filter(function (obj) {
				// for (let key in obj) {
				// 	if (key !== "id") {
				// 		let info;
				// 		info = obj[key].toLowerCase().indexOf(value) !== -1;
				// 		return info;
				// 	}
				// }
				let name = obj.FirstName.toLowerCase().indexOf(value) !== -1;
				let surname = obj.LastName.toLowerCase().indexOf(value) !== -1;
				let email = obj.Email.toLowerCase().indexOf(value) !== -1;
				let company = obj.Company.toLowerCase().indexOf(value) !== -1;
				let skype = obj.Skype.toLowerCase().indexOf(value) !== -1;
				return name || email || company || skype || surname;
			});
		});
	}
}

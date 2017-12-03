import {JetView} from "webix-jet";
import {users} from "models/users";

export default class DataViewContact extends JetView {
	config() {
		const filter = {
			view: "text", id: "filterlist", label: "Filter", labelWidth: 50
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
					// this.getRoot().queryView({view: "text"}).clear();
					this.show(`contacts.contacttemplate?id=${id}`);
				}
			}
		};

		const buttonAdd = {
			id: "btn",
			view: "button",
			type: "icon",
			icon: "plus",
			label: "Add contact",
			autowidth: true,
			click: () => {
				let btn = this.getRoot().queryView({view: "button"});
				btn.define("label", "Add");
				btn.refresh();
				this.show("contacts.contactform");
			}
		};


		const lay = {
			rows: [filter, menu, buttonAdd]
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
				let name = obj.FirstName.toLowerCase().indexOf(value) == 0;
				let email = obj.Email.toLowerCase().indexOf(value) == 0;
				return name || email;
			});
		});
	}
}

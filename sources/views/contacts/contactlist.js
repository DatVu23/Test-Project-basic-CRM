import {JetView} from "webix-jet";
import {users} from "models/users";

export default class DataViewContact extends JetView {
	config() {
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
			rows: [menu, buttonAdd]
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
	}
}

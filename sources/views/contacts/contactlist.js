import {JetView} from "webix-jet";
import {users, getUser} from "models/users";

export default class DataViewContact extends JetView {
	config() {
		let menu = {
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
			elemetns: [
				{view: "text", id: "listInput", label: "Filter", labelWidth: 150}
			],
			on: {
				onAfterSelect: (id) => {
					users.setCursor(id);
					this.show(`contacts.contacttemplate?id=${id}`);
				}
			}
		};

		let buttonAdd = {
			view: "button",
			type: "icon",
			icon: "plus",
			label: "Add contact",
			autowidth: true,
			click: () => {
				this.show("contacts.contactform");
			}
		};

		let filter = {
			view: "text", id: "list_input", label: "Filter", labelWidth: 150
		};


		let lay = {
			rows: [filter, menu, {}, buttonAdd]
		};

		return lay;
	}	init(view) {
		let list = view.queryView({view: "list"});
		list.parse(getUser());
		getUser().waitData.then(function () {
			let id = list.getFirstId();
			list.select(id);
		});
		$$("list_input").attachEvent("onTimedKeyPress", function () {
			let value = this.getValue().toLowerCase();
			$$("contactlist").filter(function (obj) {
				return obj.FirstName.toLowerCase().indexOf(value) == 0;
			});
		});
	}
}

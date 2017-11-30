import {JetView} from "webix-jet";
import {getUser, setUsers, removeUsers, getInfo} from "models/users";
import DataViewTemplate from "views/userinfo";

export default class DataViewContact extends JetView {
	config() {
		let menu = {
			view: "list",
			id: "top:list",
			width: 480,
			select: true,
			template: "<img src='#Photo#'> #FirstName# #LastName# <br> #Email#",
			scroll: true,
			type: {
				height: 70,
				css: "webix_icon fa-users"
			},
			on: {
				onAfterSelect(id) {
					this.$scope.app.callEvent("contactinfo", [id]);
				}
			}

		};

		let removebutton = {
			view: "button",
			type: "icon",
			icon: "trash",
			label: "delete",
			width: 200,
			autowidth: true
		};


		let buttonedit = {
			view: "button",
			label: "edit",
			type: "icon",
			icon: "edit",
			autowidth: true,
			align: "center"
		};

		let lay = {
			cols: [
				{
					rows: [menu]
				},
				{
					rows: [
						{
							cols: [DataViewTemplate, {
								rows: [
									{
										cols: [buttonedit, removebutton]
									},
									{}
								]
							}
							]
						},
						{}
					]
				}
			]
		};

		return lay;
	}	init(view) {
		let list = view.queryView({view: "list"});
		list.parse(getUser());
		getUser().waitData.then(function () {
			let id = list.getFirstId();
			list.select(id);
		});
	}
}

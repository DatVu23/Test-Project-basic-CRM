import {JetView} from "webix-jet";
import {getActivities} from "models/activities";
import {getActivitytypes} from "models/activitytypes";
import {getInfo} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class ViewActivities extends JetView {
	config() {
		getActivitytypes().then(function (state) {
			let table = $$("table");
			table.getColumnConfig("TypeID").collection = state;
			table.refreshColumns();
		});

		let toolbar = {
			view: "toolbar",
			elements: [
				{},
				{
					view: "button",
					value: "Add activity",
					autowidth: true,
					align: "right",
					click: () => this.ViewActivityForm.showWindow()
				}
			]
		};

		let datatable = {
			view: "datatable",
			id: "table",
			select: true,
			editable: true,
			editaction: "dbclick",
			columns: [
				{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open", width: 55},
				{id: "TypeID", header: ["Activity Type", {content: "selectFilter"}], editor: "richselect", width: 200},
				{id: "DueDate", header: ["Due Data", {content: "textFilter"}], editor: "date", width: 300},
				{id: "Details", header: ["Details", {content: "textFilter"}], width: 300},
				{id: "ContactID", header: ["Contact", {content: "selectFilter"}], width: 400},
				{id: "edit", template: "<span class='webix_icon fa-edit'></span>", width: 55},
				{id: "delete", template: "<span class='webix_icon fa-trash'></span>", width: 55}
			],
			onClick: {
				"fa-trash": (ev, id) => {
					getActivities().remove(id);
				},
				"fa-edit": (ev, id) => {
					this.ViewActivityForm.showWindow(id);
				}
			}
		};

		return {rows: [toolbar, datatable]};
	}
	init(view) {
		let datatable = view.queryView({view: "datatable"});
		datatable.parse(getActivities());
		getInfo().then(function (obj) {
			datatable.getColumnConfig("ContactID").collection = obj;
			datatable.refreshColumns();
		});

		this.ViewActivityForm = this.ui(ViewActivityForm);
	}
}

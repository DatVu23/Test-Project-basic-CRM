import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {getActivityTypes} from "models/activitytypes";
import {getInfo} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class ViewActivities extends JetView {
	config() {
		getActivityTypes().then(function (state) {
			let table = $$("table");
			table.getColumnConfig("TypeID").collection = state;
			table.refreshColumns();
		});

		const toolbar = {
			view: "toolbar",
			id: "toolbar",
			elements: [
				{
					view: "segmented",
					id: "filterDate",
					name: "filterDateName",
					options: [
						{id: "All", value: "All"},
						{id: "Overdue", value: "Overdue"},
						{id: "Today", value: "Today"},
						{id: "Tomorrow", value: "Tomorrow"},
						{id: "This week", value: "This week"},
						{id: "This month", value: "This month"}
					],
					click: () => this.filterTable()
				},
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


		const datatable = {
			view: "datatable",
			id: "table",
			select: true,
			editable: true,
			editaction: "dbclick",
			columns: [
				{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open"},
				{id: "TypeID", header: ["Activity Type", {content: "selectFilter"}], editor: "richselect"},
				{id: "DueDate", header: ["Due Data", {content: "textFilter"}], format: webix.i18n.dateFormatStr, editor: "date", fillspace: true},
				{id: "Details", header: ["Details", {content: "textFilter"}], fillspace: true},
				{id: "ContactID", header: ["Contact", {content: "selectFilter"}], fillspace: true},
				{id: "edit", template: "<span class='webix_icon fa-edit'></span>"},
				{id: "delete", template: "<span class='webix_icon fa-trash'></span>"}
			],
			onClick: {
				"fa-trash": (ev, id) => {
					activities.remove(id);
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
		datatable.parse(activities);
		getInfo().then(function (obj) {
			datatable.getColumnConfig("ContactID").collection = obj;
			datatable.refreshColumns();
		});

		this.ViewActivityForm = this.ui(ViewActivityForm);
	}

	filterTable() {
		const value = this.getRoot().queryView({name: "filterDateName"}).getValue();
		const table = this.getRoot().queryView({view: "datatable"});
		let currDate = new Date();
		let currDatePart = webix.Date.datePart(currDate);

		switch (value) {
			case "All" : {
				table.parse(activities);
				break;
			}
			case "Overdue" : {
				table.filter(obj => obj.DueDate < currDate);
				break;
			}
			case "Completed": {
				table.filter(obj => obj.State === "Close");
				break;
			}
			case "Today": {
				table.filter((obj) => {
					if (webix.Date.equal(obj.DueDate, currDatePart)) {
						return obj;
					}
				});
				break;
			}
			case "Tomorrow": {
				table.filter(obj => obj.DueDate.getDay() === currDate.getDay() + 1 &&
				obj.DueDate.getYear() === currDate.getYear());
				break;
			}
			case "This week": {
				table.filter((obj) => {
					if (webix.Date.equal(webix.Date.weekStart(obj.DueDate), webix.Date.weekStart(currDate))) {
						return obj;
					}
				});
				break;
			}
			case "This month": {
				table.filter(obj => obj.DueDate.getMonth() === currDate.getMonth() &&
				obj.DueDate.getYear() === currDate.getYear());
				break;
			}
			default: {
				table.parse(activities);
				break;
			}
		}
	}
}

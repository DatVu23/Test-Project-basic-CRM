import {JetView} from "webix-jet";
import {activities} from "models/activities";
import {getActivityTypes} from "models/activitytypes";
import {getInfo} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class ViewActivities extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const toolbar = {
			view: "toolbar",
			id: "toolbar",
			elements: [
				{
					view: "segmented",
					id: "filterDate",
					name: "filterDateName",
					options: [
						{id: "All", value: _("All")},
						{id: "Overdue", value: _("Overdue")},
						{id: "Today", value: _("Today")},
						{id: "Tomorrow", value: _("Tomorrow")},
						{id: "This week", value: _("This week")},
						{id: "This month", value: _("This month")}
					],
					click: () => this.filterTable()
				},
				{},
				{
					view: "button",
					value: _("Add activity"),
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
				{id: "TypeID", header: [_("Activity Type"), {content: "selectFilter"}], editor: "richselect"},
				{id: "DueDate", header: [_("Due date"), {content: "textFilter"}], format: webix.i18n.dateFormatStr, editor: "date", fillspace: true},
				{id: "Details", header: [_("Details"), {content: "textFilter"}], fillspace: true},
				{id: "ContactID", header: [_("Contact"), {content: "selectFilter"}], fillspace: true},
				{id: "edit", header: _("edit"), template: "<span class='webix_icon fa-edit'></span>"},
				{id: "delete", header: _("delete"), template: "<span class='webix_icon fa-trash'></span>"}
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

		getActivityTypes().then(function (state) {
			let table = $$("table");
			table.getColumnConfig("TypeID").collection = state;
			table.refreshColumns();
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

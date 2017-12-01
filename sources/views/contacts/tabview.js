import {JetView} from "webix-jet";
import {getActivities, setActivities} from "models/activities";
import {getActivitytypes} from "models/activitytypes";
import {users} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class TabView extends JetView {
	config() {
		let buttonAddActivity = {
			view: "button",
			label: "Add activity",
			type: "icon",
			icon: "plus",
			autowidth: true,
			align: "right",
			css: "buttonAddActivity",
			click: () => {
				let id = users.getCursor();
				this.ViewActivityForm.showWindow(id, "param");
			}
		};

		let tabView = {
			view: "tabview",
			cells: [
				{
					header: "Activities",
					body: {
						rows: [
							{id: "activitiesView",
								view: "datatable",
								minHeight: 250,
								minWidth: 900,
								columns: [
									{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open", width: 55},
									{id: "TypeID", header: ["Activity Type", {content: "selectFilter"}], editor: "richselect", width: 200},
									{id: "DueDate", header: ["Due Data", {content: "textFilter"}], editor: "date", width: 250},
									{id: "Details", header: ["Details", {content: "textFilter"}], fillspace: true},
									{id: "edit", template: "<span class='webix_icon fa-edit'></span>", width: 50},
									{id: "delete", template: "<span class='webix_icon fa-trash'></span>", width: 50}
								],
								onClick: {
									"fa-trash": (ev, id) => {
										getActivities().remove(id);
									},
									"fa-edit": (ev, id) => {
										this.ViewActivityForm.showWindow(id);
									}
								}
							},
							buttonAddActivity
						]
					}
				},
				{
					header: "Files",
					body: {
						rows: [
							{
								view: "list",
								id: "listOfPhotos",
								template: "Uploader Files",
								width: 900
							},
							{
								view: "uploader",
								value: "Uploaded file",
								link: "listOfPhotos"
							}
						]
					}
				}
			]
		};
		return tabView;
	}
	init(view) {
		let datatable = view.queryView({view: "datatable"});
		datatable.parse(getActivities());

		getActivitytypes().then(function (type) {
			datatable.getColumnConfig("TypeID").collection = type;
			datatable.refreshColumns();
		});

		this.ViewActivityForm = this.ui(ViewActivityForm);
	}
}

import {JetView} from "webix-jet";
import {activities, setActivities} from "models/activities";
import {getActivitytypes} from "models/activitytypes";
import {users} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class TabView extends JetView {
	config() {
		const buttonAddActivity = {
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

		const tabView = {
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
									{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open"},
									{id: "TypeID", header: ["Activity Type", {content: "selectFilter"}], editor: "richselect"},
									{id: "DueDate", header: ["Due Data", {content: "textFilter"}], editor: "date"},
									{id: "Details", header: ["Details", {content: "textFilter"}], fillspace: true},
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
		datatable.parse(activities);

		getActivitytypes().then(function (type) {
			datatable.getColumnConfig("TypeID").collection = type;
			datatable.refreshColumns();
		});

		this.ViewActivityForm = this.ui(ViewActivityForm);
	}
	urlChange(view, url) {
		if (url[0].params.id) {
			let id = url[0].params.id;
			if (this._ev) {
				view.queryView({view: "datatable"}).data.detachEvent(this._ev);
			}
			this._ev = view.queryView({view: "datatable"}).data.attachEvent("onAfterFilter", function () {
				this.blockEvent();
				this.filter("#ContactID#", id, true);
				this.unblockEvent();
			});

			$$("activitiesView").data.sync(activities, function () {
				this.filter(function (item) {
					return item.ContactID == id;
				});
			});
		}
	}
}

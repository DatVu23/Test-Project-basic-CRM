import {JetView} from "webix-jet";
import {activities, setActivities} from "models/activities";
import {getActivityTypes} from "models/activitytypes";
import {users} from "models/users";
import ViewActivityForm from "views/contacts/formwindow";

export default class TabView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const buttonAddActivity = {
			view: "button",
			label: _("Add activity"),
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
					header: _("Activities"),
					body: {
						rows: [
							{id: "activitiesView",
								view: "datatable",
								minHeight: 250,
								minWidth: 900,
								columns: [
									{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open"},
									{id: "TypeID", header: [_("Activity Type"), {content: "selectFilter"}], editor: "richselect"},
									{id: "DueDate", header: [_("Due date"), {content: "textFilter"}], format: webix.i18n.dateFormatStr, editor: "date"},
									{id: "Details", header: [_("Details"), {content: "textFilter"}], fillspace: true},
									{id: "edit", header: "edit", template: "<span class='webix_icon fa-edit'></span>"},
									{id: "delete", header: "delete", template: "<span class='webix_icon fa-trash'></span>"}
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
					header: _("Files"),
					body: {
						rows: [
							{
								view: "list",
								id: "listOfPhotos",
								template: "Uploader Files",
								minWidth: 900
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

		getActivityTypes().then(function (type) {
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
			let dtable = $$("activitiesView");
			dtable.getFilter("TypeID").value = "";
			dtable.getFilter("Details").value = "";
			dtable.getFilter("DueDate").value = "";
			dtable.filterByAll();

			$$("activitiesView").data.sync(activities, function () {
				this.filter(function (item) {
					return item.ContactID == id;
				});
			});
		}
	}
}

import {JetApp, JetView} from "webix-jet";
import {activities} from "models/activities";
import {activitytypes, getActivityTypes, getTypesIcon, setActivityTypes} from "models/activitytypes";
import {users, getInfo} from "models/users";
import {statuses, getStatusesTypes, getStatusesIcon} from "models/statuses";
import ViewActivityForm from "views/activity/activityForm";
import ViewStatusesForm from "views/activity/statusesForm";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		const localeSelector = {
			type: "space",
			rows: [
				{template: _("Settings"), type: "header"},
				{name: "lang",
					optionWidth: 120,
					view: "segmented",
					label: _("Language"),
					options: [
						{id: "en", value: "en"},
						{id: "ru", value: "ru"}
					],
					click: () => this.toggleLanguage(),
					value: lang},
				{}
			]
		};

		const tabView = {
			view: "tabview",
			cells: [
				{
					header: _("Activity Type"),
					body: {
						rows: [
							{id: "activitytypes",
								view: "datatable",
								editable: true,
								minHeight: 250,
								minWidth: 900,
								columns: [
									{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open"},
									{id: "id", header: ["id", {content: "selectFilter"}], editor: "text"},
									{id: "Value", header: [_("Value"), {content: "textFilter"}], editor: "text", fillspace: true},
									{id: "Icon", header: [_("Icon"), {content: "textFilter"}], editor: "text", fillspace: true},
									{id: "edit", header: _("edit"), template: "<span class='webix_icon fa-edit'></span>"},
									{id: "delete", header: _("delete"), template: "<span class='webix_icon fa-trash'></span>"}
								],
								onClick: {
									"fa-trash": (ev, id) => {
										activitytypes.remove(id);
									},
									"fa-edit": (ev, id) => {
										this.ViewActivityForm.showWindow(id);
									}
								}
							},
							{
								view: "button",
								label: _("Add smthing"),
								type: "icon",
								icon: "plus",
								autowidth: true,
								align: "right",
								css: "buttonAddActivity",
								click: () => {
									let id = users.getCursor();
									this.ViewActivityForm.showWindow(id);
								}
							}
						]
					}
				},
				{
					header: _("Contact Statuses"),
					body: {
						rows: [
							{id: "contactStatuses",
								view: "datatable",
								editable: true,
								minHeight: 250,
								minWidth: 900,
								columns: [
									{id: "State", header: "", template: "{common.checkbox()}", editor: "checkbox", checkValue: "Close", unCheckValue: "Open"},
									{id: "id", header: ["id", {content: "selectFilter"}], editor: "text"},
									{id: "Value", header: ["Name", {content: "textFilter"}], editor: "text", fillspace: true},
									{id: "Icon", header: ["Icon", {content: "textFilter"}], editor: "text", fillspace: true},
									{id: "edit", template: "<span class='webix_icon fa-edit'></span>"},
									{id: "delete", template: "<span class='webix_icon fa-trash'></span>"}
								],
								onClick: {
									"fa-trash": (ev, id) => {
										statuses.remove(id);
									},
									"fa-edit": (ev, id) => {
										this.ViewStatusesForm.showWindow(id);
									}
								}
							},
							{
								view: "button",
								label: _("Add smthing"),
								type: "icon",
								icon: "plus",
								autowidth: true,
								align: "right",
								css: "buttonAddActivity",
								click: () => {
									let id = users.getCursor();
									this.ViewStatusesForm.showWindow(id);
								}
							}
						]
					}
				}
			]
		};

		return {rows: [localeSelector, tabView]};
	}
	init() {
		let statusesTable = $$("contactStatuses");
		statusesTable.parse(statuses);

		let datatableTypes = $$("activitytypes");
		datatableTypes.parse(activitytypes);

		this.ViewActivityForm = this.ui(ViewActivityForm);
		this.ViewStatusesForm = this.ui(ViewStatusesForm);
	}
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({name: "lang"}).getValue();
		langs.setLang(value);
	}
}

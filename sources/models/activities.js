export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest-> http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			if (obj.DueDate) { obj.DueDate = webix.i18n.parseFormatDate(obj.DueDate); }
		},
		$save(obj) {
			if (obj.DueDate) { obj.DueDate = webix.i18n.parseFormatStr(obj.DueDate); }
		}
	}
});

export function getActivity(id) {
	return activities.getItem(id);
}

export function setActivities(id, data) {
	if (!id) { activities.add(data); }
	else { activities.updateItem(id, data); }
}

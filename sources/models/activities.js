export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/", save: "rest-> http://localhost:8096/api/v1/activities/"
});

export function getActivity(id) {
	return activities.getItem(id);
}

export function getActivities() {
	return activities;
}

export function setActivities(id, data) {
	if (!id) { activities.add(data); }
	else { activities.updateItem(id, data); }
}

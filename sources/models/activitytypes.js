export const activitytypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/", save: "rest-> http://localhost:8096/api/v1/activitytypes/"
});

export function getActivityTypes() {
	return activitytypes.waitData.then(webix.bind(function () {
		let state = [];
		this.data.each(function (obj) {
			state.push({id: obj.id, value: obj.Value});
		});
		return state;
	}, activitytypes));
}

export function getTypesIcon() {
	return activitytypes.waitData.then(webix.bind(function () {
		let icon = [];
		this.data.each(function (obj) {
			icon.push({id: obj.id, value: obj.Icon});
		});
		return icon;
	}, activitytypes));
}

export function setActivityTypes(id, data) {
	if (!id) { activitytypes.add(data); }
	else { activitytypes.updateItem(id, data); }
}

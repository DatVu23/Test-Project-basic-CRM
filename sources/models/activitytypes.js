export const activitytypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/", save: "rest-> http://localhost:8096/api/v1/activitytypes/"
});

export function getTypes() {
	return activitytypes;
}

export function getActivitytypes() {
	return activitytypes.waitData.then(webix.bind(function () {
		let state = [];
		this.data.each(function (obj) {
			state.push({id: obj.id, value: obj.Value});
		});
		return state;
	}, activitytypes));
}

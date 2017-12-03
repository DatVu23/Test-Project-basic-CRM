export const statuses = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/", save: "rest-> http://localhost:8096/api/v1/statuses/"
});

export function setStatuses(id, data) {
	if (!id) { statuses.add(data); }
	else { statuses.updateItem(id, data); }
}

export function getStatusesTypes() {
	return statuses.waitData.then(webix.bind(function () {
		let state = [];
		this.data.each(function (obj) {
			state.push({id: obj.id, value: obj.Value});
		});
		return state;
	}, statuses));
}

export function getStatusesIcon() {
	return statuses.waitData.then(webix.bind(function () {
		let icon = [];
		this.data.each(function (obj) {
			icon.push({id: obj.id, value: obj.Icon});
		});
		return icon;
	}, statuses));
}

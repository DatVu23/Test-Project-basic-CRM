import {JetView} from "webix-jet";
import DataViewContact from "views/contacts/contactlist";

export default class Contact extends JetView {
	config() {
		let lay = {
			cols: [
				{
					rows: [DataViewContact]
				},
				{
					$subview: true
				}
			]
		};
		return lay;
	}
}

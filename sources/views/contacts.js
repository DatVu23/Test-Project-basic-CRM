import {JetView} from "webix-jet";
import DataViewTemplate from "views/contacts/contacttemplate";
import ContactForm from "views/contacts/contactform";
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

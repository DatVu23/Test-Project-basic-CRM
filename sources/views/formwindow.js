import {JetView} from "webix-jet";
import {users, getUser, getUsers} from "models/users";
import {getActivities, setActivities} from "models/activities";
import {getActivitytypes, getTypes} from "models/activitytypes";



export default class ViewActivityForm extends JetView{
  config(){
    var form = {
      view: "form",
      id: "widowForm",
      borderless: true,
      width: 400,
      elements: [
        {view:"textarea", label:"Details", name: "Details"},
        {view:"richselect", label:"Type", name:"TypeID",
        options: {
          data: getTypes(),
          body: { template: "#Value#"}
          }},
        {view:"richselect", label:"Contacts", name:"ContactID", options:{
          data: getUser(),
          body:{
            template: "#FirstName# #LastName# #Email#"
          }
        }},
        {view: "datepicker", name: "DueDate", label: "Date", format: "%d-%m-%Y", stringResult: true},
        {view:"checkbox", label:"Complited", name:"State",  checkValue: "Close", unCheckValue: "Open"},
        {cols: [
          {view:"button", value:"Add(Save)", click() {this.$scope.saveData()}},
          {view:"button", value:"cancel", click() {this.$scope.hideWindow()} }
        ]}
      ],
			rules: {
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty
			}
    };

    var windowPopUp = {
      id:"popUp",
      view:"window",
      position:"center",
      modal: true,
      head:"Add(*edit)activity",
      body: form
    };

    return windowPopUp;
  }
  showWindow() {
    this.getRoot().show()
  }
  hideWindow() {
    this.getRoot().hide()
  }
  saveData() {
    if($$("widowForm").validate()) {
      const loadData = $$("widowForm").getValues();
      setActivities(loadData.id, loadData);
      this.getRoot().hide();
    }
  }
};

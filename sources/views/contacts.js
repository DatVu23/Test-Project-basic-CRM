import {JetView} from "webix-jet";
import {users, getUsers, getUser, setUsers, removeUsers, getInfo} from "models/users";
import DataViewTemplate from "views/userinfo";

export default class DataViewContact extends JetView{

	config(){
    var menu = {
      view:"list", id:"top:list",
      width:480,  select:true,
      template:"<img src='#Photo#'> #FirstName# #LastName# <br> #Email#",
      scroll: true,
			type: {
				height: 70,
				css:"webix_icon fa-users"
			},
			on:{
				onAfterSelect:function(id){
					this.$scope.app.callEvent("contactinfo", [id])
				}
			}

    };

		var removebutton = {
			view: "button",
			type: "icon",
			icon: "trash",
			label: "delete",
			width: 200,
			autowidth: true
	};


		var buttonedit = {
			view: "button",
			label: "edit",
			type: "icon",
			icon: "edit",
			autowidth: true,
			align: "center"
		};

    var lay = {
      cols: [{rows: [menu]}, {rows: [{cols: [DataViewTemplate, {rows: [{cols: [buttonedit, removebutton]}, {}]}]}, {}]}]
    };

    return lay;

	}	init(view){
			var list = view.queryView({ view:"list"});
			list.parse(getUser());
			getUser().waitData.then(function(){
				var id = list.getFirstId();
				list.select(id);
			})
		}

}

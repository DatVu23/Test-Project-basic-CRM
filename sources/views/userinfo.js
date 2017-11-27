import {JetView} from "webix-jet";
import {users, getUsers, setUsers} from "models/users";
import {status} from "models/status";

export default class DataViewTemplate extends JetView {

  config() {

    var user = {
    view:"template",borderless: true,
    id: "userTemplate",
    autoheight: true,
    template: function userinfo(user) {
      var username = "<h1 class='top-name'>Name Surname</h1>";
      var photo = "<img src='/sources/images/mail.png'; class='box'>";
      var email = "<div class='info_of_user'><span class ='icons webix_icon fa-envelope'></span>Email<br>";
      var skype = "<span class ='icons webix_icon fa-skype icon_user'></span>Skype<br>";
      var job = "<span class ='icons webix_icon fa-tag'></span>Job<br>";
      var company = "<span class ='icons webix_icon fa-briefcase'></span>Company</div>";
      var birthday = "<div class='info_user'><span class ='icons webix_icon fa-calendar'></span>Birthday<br>";
      var location = "<span class ='icons webix_icon fa-map-marker'></span>Location<br></div>";
      var status = "<p class='status'>Status</p>";

      if (user.FirstName) {
        username = "<h1 class='top-name'>" + user.FirstName + " " +user.LastName + "</h1>";
      }
      if (user.Photo) {
        photo = "<img src='/sources/images/mail.png'; class='box'>";
      }
      if (user.Email) {
        email = "<div class='info_of_user'><span class ='icons webix_icon fa-envelope'></span>" + user.Email + "<br>";
      }
      if (user.Skype) {
        skype = "<span class ='icons webix_icon fa-skype icon_user'></span>" + user.Skype + "<br>";
      }
      if (user.Job) {
        job = "<span class ='icons webix_icon fa-tag'></span>" + user.Job + "<br>";
      }
      if (user.Company) {
        company = "<span class ='icons webix_icon fa-briefcase'></span>" + user.Company + "</div>";
      }
      if (user.Birthday) {
        birthday = "<div class='info_user'><span class ='icons webix_icon fa-calendar'></span>" + user.Birthday + "<br>";
      }
      if (user.id) {
        status = "<p class='status'>" + user.Status + "</p>";
      }

      var info = username + photo +
      email + skype + job + company + birthday + location + status;

        return info;
      }
    };
      return user;
  }
    init() {
    this.on(this.app, "contactinfo", (id) => {
      var contact = getUsers(id);
      status.waitData.then(function() {
        var obj = status.getItem(contact.StatusID+1);
        contact.Status = obj.Value;
        $$("userTemplate").parse(contact);
      });
    })
  }
}

import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { ProfileService } from "../../providers/profile.service";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  constructor(
    private app: App,
    private profile: ProfileService,
    private auth: AuthService) {

  }

  ionViewDidEnter() {
      this.profile.get()
        .subscribe(profile => {
            console.log(profile);
        })
  }

  logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(StartPage);
  }
}
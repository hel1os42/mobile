import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  constructor(
    private app: App,
    private auth: AuthService) {

  }

  logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(StartPage);
  }
}
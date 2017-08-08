import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {

  constructor(
    private nav: NavController,
    private auth: AuthService) {

  }

  logout() {
    this.auth.logout();
    this.nav.setRoot(StartPage);
  }
}
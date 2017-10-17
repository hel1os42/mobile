import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignUpInvitePage } from '../invite/invite';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  constructor(
    private nav: NavController) {
  }

  login() {
    this.nav.push(LoginPage);
  }

  register() {
    this.nav.push(SignUpInvitePage);
  }
}

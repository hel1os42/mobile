import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

import { SignUpInvitePage } from '../invite/invite';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  invite: string = "";

  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }

  login() {
    this.nav.push(LoginPage);
  }

  register() {
    this.auth.getInviteCode();
    let page = this.invite ? SignUpPage : SignUpInvitePage;
    this.nav.push(page);


  }
}

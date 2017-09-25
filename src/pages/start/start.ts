import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

import { SignUpInvitePage } from '../invite/invite';
import { ApiService } from '../../providers/api.service';

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

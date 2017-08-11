import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { InvitePage } from "../invite/invite";
import { SignUpPage } from "../sign-up/signup";

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }

  login() {
    this.nav.push(LoginPage);
  }

  register() {
    this.nav.push(SignUpPage);

    // let inviteCode = this.auth.getInviteCode();
    // if (inviteCode)
    //   this.nav.push(RegisterPage);
    // else
    //   this.nav.push(InvitePage);
  }
}

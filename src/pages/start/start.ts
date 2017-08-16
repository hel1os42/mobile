import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { CreateUserProfilePage } from "../create-user-profile/create-user-profile";
import { InvitePage } from "../invite/invite";
import { SignUpPage } from "../signup/signup";

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
    //   this.nav.push(CreateUserProfile);
    // else
    //   this.nav.push(InvitePage);
  }
}

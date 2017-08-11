import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { InvitePage } from "../invite/invite";
import { SignUpCodePage } from "../signup-code/signup-code";

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnBoardingPage {
  code: string;

  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }

getCode() {
  this.auth.applyCode(this.code);
   this.nav.push(SignUpCodePage);
}

}
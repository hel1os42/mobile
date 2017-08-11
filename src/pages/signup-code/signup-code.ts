import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { InvitePage } from "../invite/invite";

@Component({
  selector: 'page-sign-up-code',
  templateUrl: 'sign-up-code.html'
})
export class SignUpCodePage {
  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }
}


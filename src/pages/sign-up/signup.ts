import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { InvitePage } from "../invite/invite";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {
  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }
}
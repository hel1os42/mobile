import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { RegisterPage } from "../register/register";

@Component({
  selector: 'page-signup-code',
  templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
  code: string;

  constructor(
    private nav: NavController,
    private auth: AuthService) {
  }

  getCode() {
    this.auth.applyCode(this.code);
    this.nav.push(RegisterPage);
  }
}


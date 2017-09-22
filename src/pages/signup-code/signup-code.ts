import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { CreateUserProfilePage } from "../create-user-profile/create-user-profile";
import { Register } from '../../models/register';

@Component({
  selector: 'page-signup-code',
  templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
  register: Register;

  constructor(
      private nav: NavController,
      private auth: AuthService,
      private navParams: NavParams) {

      this.register = this.navParams.get('register');
      this.register.code = this.register.phone.slice(-6);
  }

  signUp() {
    this.auth.register(this.register)
      .subscribe(resp => {
        this.auth
          .login({
            phone: this.register.phone,
            code: this.register.code
          })
          .subscribe(resp => {
            this.nav.setRoot(CreateUserProfilePage);
          })
      })
  }

}
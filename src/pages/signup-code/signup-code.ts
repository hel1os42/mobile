import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { CreateUserProfilePage } from "../create-user-profile/create-user-profile";

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
    this.auth.applyCode(this.code)
        .subscribe(res => {                                    
            this.nav.push(CreateUserProfilePage);
        });    
  }
}


import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { CreateUserProfilePage } from "../create-user-profile/create-user-profile";
import { Register } from '../../models/register';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-signup-code',
    templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
    register: Register;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
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
                        this.appMode.setHomeMode(false);
                        this.nav.setRoot(CreateUserProfilePage);
                    })
              })
    }

    sliceStr(str: string) {
        if (str.length > 6) {
            this.register.code = str.slice(0, 5);  
        }
    }
}

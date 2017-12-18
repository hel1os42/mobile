import { StringValidator } from '../../validators/string.validator';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Register } from '../../models/register';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';

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
        // this.register.code = this.register.phone.slice(-6);
    }

    updateList(ev) {
        StringValidator.updateList(ev);
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

    limitStr(str: string) {
        this.register.code = StringValidator.stringLimitMax(str, 6);
    }
}

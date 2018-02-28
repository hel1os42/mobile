import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Register } from '../../models/register';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { StringValidator } from '../../validators/string.validator';
import { TemporaryPage } from '../temporary/temporary';

@Component({
    selector: 'page-signup-code',
    templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
    register: Register;
    envName: string;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private navParams: NavParams) {

        this.register = this.navParams.get('register');
        this.envName = this.appMode.getEnvironmentMode();
        if (this.envName === 'dev' || this.envName === 'test') {
            this.register.code = this.register.phone.slice(-6);
        }

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
                    .subscribe(res => {
                        // this.nav.setRoot(CreateUserProfilePage, { user: resp});
                        // this.nav.setRoot(CreateUserProfilePage);temporary
                        this.nav.setRoot(TemporaryPage);// temporary
                    })
            })
    }

    limitStr(str: string) {
        this.register.code = StringValidator.stringLimitMax(str, 6);
    }
}

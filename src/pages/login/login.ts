import { TemporaryPage } from '../temporary/temporary';
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { StringValidator } from '../../validators/string.validator';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { SignUpInvitePage } from '../invite/invite';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    authData: Login = {
        phone: '',
        code: ''
    };
    numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    numCode: string = '+380';
    page;
    clickMode = 0;
    envMode: string;
    isVisibleLoginButton = false;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private profile: ProfileService,
        private alert: AlertController) {

        this.envMode = this.appMode.getEnvironmentMode();

    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getDevMode() {
        return this.appMode.getEnvironmentMode() === 'dev';
    }

    getOtp() {
        if (this.getDevMode()) {
            this.isVisibleLoginButton = true;
            this.authData.code = this.authData.phone.slice(-6);
        }
        else {
            this.auth.getOtp(this.numCode + this.authData.phone)
                .subscribe(() => {
                    this.isVisibleLoginButton = true;
                });
        }

    }

    login() {
        this.auth.login({
            phone: this.numCode + this.authData.phone,
            code: this.authData.code
        })
            .subscribe(
            resp => {
                this.appMode.setHomeMode(true);
                // this.profile.get(true)
                //     .subscribe(res => {
                //         if (res.name == '' && !res.email) {
                //             this.nav.setRoot(CreateUserProfilePage)
                //         }
                //         else {
                //             this.nav.setRoot(TabsPage, { index: 0 });
                //         }
                //     });temporary

                this.nav.setRoot(TemporaryPage);//temporary(to remove)

            });
    }

    signup() {
        this.nav.push(SignUpInvitePage);
    }

    limitStr(str: string, length: number) {
        if (length == 12) this.authData.phone = StringValidator.stringLimitMax(str, length);
        else this.authData.code = StringValidator.stringLimitMax(str, length);
    }

    presentPrompt(selected: boolean) {
        let prompt = this.alert.create({
            title: 'Choose environment',
            message: '',
            inputs: [
                {
                    type: 'radio',
                    label: 'develop',
                    value: 'dev',
                    checked: this.envMode == 'dev'
                },
                {
                    type: 'radio',
                    label: 'test',
                    value: 'test',
                    checked: this.envMode == 'test'
                },
                {
                    type: 'radio',
                    label: 'production',
                    value: 'prod',
                    checked: this.envMode == 'prod'
                }],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.clickMode = 0;
                        return;
                    }
                },
                {
                    text: 'Ok',
                    handler: (data) => {
                        if (!data || this.envMode == data) {
                            return;
                        }
                        else {
                            this.envMode = data;
                            this.appMode.setEnvironmentMode(data);
                        }
                    }
                }
            ]
        });
        prompt.present();
        this.clickMode = 0;
    }

    toggleMode() {
        this.clickMode = this.clickMode + 1;
        if (this.clickMode >= 5) {
            this.presentPrompt(false);
        }
    }
}

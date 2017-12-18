import { StringValidator } from '../../validators/string.validator';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertController, NavController } from 'ionic-angular';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
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
    isDevMode: boolean;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private profile: ProfileService,
        private builder: FormBuilder,
        private alertCtrl: AlertController) {

        this.isDevMode = this.appMode.getDevMode();

    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    login() {
        this.authData
        this.auth
            .login({
                phone: this.numCode + this.authData.phone,
                code: this.authData.code
                // code: this.authData.phone.slice(-6)
            })
            .subscribe(
            resp => {
                this.appMode.setHomeMode(true);
                this.profile.get(true)
                    .subscribe(resp => {
                        if (resp.name == '' && !resp.email) {
                            this.nav.setRoot(CreateUserProfilePage)
                        }
                        else {
                            this.nav.setRoot(TabsPage, { index: 0 });
                        }
                    });
            });
    }

    signup() {
        this.nav.push(SignUpInvitePage);
    }

    limitStr(str: string, length: number) {
        if (length == 12) this.authData.phone = StringValidator.stringLimitMax(str, length);
        else this.authData.code = StringValidator.stringLimitMax(str, length);
    }

    presentConfirm(selected: boolean) {
        let content = selected ?
            {
                title: 'Development mode is already selected',
                message: 'Exit development mode?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            return;
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            this.isDevMode = false;
                            this.appMode.setDevMode(this.isDevMode);
                            this.clickMode = 0;
                        }
                    }
                ]
            } :
            {
                title: 'The test mode will be selected',
                message: 'Are you sure?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            this.clickMode = 0;
                        }
                    },
                    {
                        text: 'Ok',
                        handler: () => {
                            this.isDevMode = true;
                            this.appMode.setDevMode(this.isDevMode);
                            this.clickMode = 0;
                        }
                    }
                ]
            };
        let confirm = this.alertCtrl.create(content);
        confirm.present();
    }

    toggleMode() {
        this.clickMode = this.clickMode + 1;
        if (this.appMode.getDevMode()) {
            this.presentConfirm(true);
        }
        else {
            if (this.clickMode >= 5) {
                this.presentConfirm(false);
            }
        }
    }
}

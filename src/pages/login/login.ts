import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, Select } from 'ionic-angular';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { StringValidator } from '../../validators/string.validator';
import { TemporaryPage } from '../temporary/temporary';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    authData: Login = {
        phone: '',
        code: ''
    };
    //numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    numCode: string;
    page;
    clickMode = 0;
    envName: string;
    isVisibleLoginButton = false;
    phoneCodes = PHONE_CODES;

    @ViewChild('codeSelect') codeSelect: Select;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private alert: AlertController) {
        
        this.envName = this.appMode.getEnvironmentMode();
        this.numCode = this.getNumCode();
        
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getDevMode() {
        return (this.envName === 'dev' || this.envName === 'test');
    }

    getNumCode() {
        return  this.numCode = this.getDevMode() ? '+380' : this.phoneCodes[0].dial_code;
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
            .subscribe(resp => {
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
        this.nav.push(SignUpPage);
    }

    limitStr(str: string, length: number) {
        if (length == 14) this.authData.phone = StringValidator.stringLimitMax(str, length);
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
                    checked: this.envName == 'dev'
                },
                {
                    type: 'radio',
                    label: 'test',
                    value: 'test',
                    checked: this.envName == 'test'
                },
                {
                    type: 'radio',
                    label: 'production',
                    value: 'prod',
                    checked: this.envName == 'prod'
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
                        if (!data || this.envName == data) {
                            return;
                        }
                        else {
                            this.envName = data;
                            this.appMode.setEnvironmentMode(data);
                            this.getNumCode();
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

    dismissSelect(event) {
        this.numCode = event;
        this.codeSelect.close();
    }

    onSelectClicked(selectButton: Select): void {
        const options: HTMLCollectionOf<Element> = document.getElementsByClassName('alert-tappable alert-radio');
        (<any>selectButton._overlay).didEnter.subscribe(
          () => {
            setTimeout(() => {
              let i = 0;
              const len = options.length;
              for (i; i < len; i++) {
                if ((options[i] as HTMLElement).attributes[3].nodeValue === 'true') {
                  var modalCodes = document.getElementsByClassName('alert-full-no-button')[0] as HTMLElement;
                  modalCodes.style.display = "flex";
                  options[i].scrollIntoView({ block: 'center', behavior: 'instant' });
                }
              }
            }, 5);
          });
      }
}

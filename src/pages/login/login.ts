import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, Select, Content, Platform, Navbar } from 'ionic-angular';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { StringValidator } from '../../validators/string.validator';
import { TemporaryPage } from '../temporary/temporary';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { SignUpPage } from '../signup/signup';
import { LocationService } from '../../providers/location.service';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

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
    page;
    clickMode = 0;
    envName: string;
    isVisibleLoginButton = false;
    phoneCodes = PHONE_CODES;
    numCode = PHONE_CODES.find(item => item.code === 'US');
    onKeyboardShowSubscription: Subscription;
    // onKeyboardHideSubscription: Subscription;
    backAction;
    countDown;
    counter = 60;
    tick = 1000;
    timer;
    isRetry = false;

    @ViewChild('codeSelect') codeSelect: Select;
    @ViewChild(Content) content: Content;
    @ViewChild('navbar') navBar: Navbar;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private alert: AlertController,
        private location: LocationService,
        private keyboard: Keyboard) {

        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription = this.keyboard.onKeyboardShow()
                .subscribe(() => {
                    this.content.scrollToBottom();
                })
        }
        this.envName = this.appMode.getEnvironmentMode();
        this.numCode = this.getNumCode();
    }

    ionViewDidEnter() {
        this.navBar.backButtonClick = (ev: UIEvent) => {
            if (this.isVisibleLoginButton) {
                this.isVisibleLoginButton = false;
                this.backAction();
            }
            else this.nav.pop();
        }
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getDevMode() {
        return (this.envName === 'dev' || this.envName === 'test');
    }

    getNumCode() {
        if (this.getDevMode()) {
            this.numCode = this.phoneCodes.find(item => item.dial_code === '+380');
            return this.numCode;
        }
        else {
            this.location.getByIp()
                .subscribe(resp => {
                    this.numCode = this.phoneCodes.find(item => item.code === resp.country_code);
                    return this.numCode;
                },
                    err => {
                        this.numCode = this.phoneCodes.find(item => item.code === 'US');
                        return this.numCode;
                    })

        }
    }

    getOtp() {
        this.auth.getOtp(this.numCode.dial_code + this.authData.phone)
            .subscribe(() => {
                this.isVisibleLoginButton = true;
                this.cancelTimer();
                this.isRetry = false;
                if (this.getDevMode()) {
                    this.authData.code = this.authData.phone.slice(-4);
                }
                this.backAction = this.platform.registerBackButtonAction(() => {
                    if (this.isVisibleLoginButton) {
                        this.isVisibleLoginButton = false;
                        this.backAction();
                    }
                }, 1);
                this.countDown = Observable.timer(0, this.tick)
                    .take(this.counter)
                    .map(() => --this.counter);
                this.timer = setInterval(() => {
                    if (this.counter < 1) {
                        this.cancelTimer();
                        this.isRetry = true;
                    }
                }, 1000);
            });
    }

    login() {
        this.auth.login({
            phone: this.numCode.dial_code + this.authData.phone,
            code: this.authData.code
        })
            .subscribe(resp => {
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

    cancelTimer() {
        this.stopTimer();
        this.countDown = undefined;
        this.counter = 60;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
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
                },
                {
                    type: 'radio',
                    label: 'fork',
                    value: 'fork',
                    // checked: this.envName == 'prod'
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
                            if (data === 'fork') {
                                this.envName = 'prod';
                                this.appMode.setForkMode();// only for fork mode;
                                this.appMode.setEnvironmentMode('prod');
                                debugger
                            }
                            else {
                                this.envName = data;
                                this.appMode.setEnvironmentMode(data);
                                this.getNumCode();
                            }
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

    onSelectClicked(selectButton: Select) {
        (<any>selectButton._overlay).didEnter.subscribe(
            () => {
                setTimeout(() => {
                    // document.querySelector('[aria-checked="true"]')
                    //     .scrollIntoView({ block: 'center', behavior: 'instant' });
                    const options = document.getElementsByClassName('alert-tappable alert-radio');
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].attributes[3].nodeValue === 'true') {
                            options[i].scrollIntoView({ block: 'center', behavior: 'instant' })
                        }
                    }
                }, 5);
            }
        );
    }

    ionViewDidLeave() {
        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription.unsubscribe();
        }
        if (this.backAction) {
            this.backAction();
        }
    }
}

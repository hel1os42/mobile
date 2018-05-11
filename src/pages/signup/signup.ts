import { AppModeService } from '../../providers/appMode.service';
import { Register } from '../../models/register';
import { StringValidator } from '../../validators/string.validator';
import { Component, ViewChild } from '@angular/core';
import { NavController, Select, Platform, Content, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { StorageService } from '../../providers/storage.service';
import { LocationService } from '../../providers/location.service';
import { Subscription } from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { OneSignal } from '@ionic-native/onesignal';
import { SocialData } from '../../models/socialData';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    formData = {
        phone: '',
        code: ''
    };
    phoneNumber: string;
    phoneCodes = PHONE_CODES;
    numCode = PHONE_CODES.find(item => item.code === 'US');
    envName: string;
    onKeyboardShowSubscription: Subscription;
    onKeyboardHideSubscription: Subscription;
    termsUrl = 'https://nau.io/terms';
    policyUrl = 'https://nau.io/privacy-policy';
    socialData: SocialData;

    @ViewChild('codeSelect') codeSelect: Select;
    @ViewChild(Content) content: Content;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private storage: StorageService,
        private location: LocationService,
        private keyboard: Keyboard,
        private browser: InAppBrowser,
        private analytics: GoogleAnalytics,
        private oneSignal: OneSignal,
        private navParams: NavParams) {

        this.socialData = this.navParams.get('social');

        if (this.platform.is('android')) {
            //this.onKeyboardShowSubscription = this.keyboard.onKeyboardShow()
            //    .subscribe((resp) => {
            //        this.content.scrollTo(1, resp.keyboardHeight - 30);
            //    })
            let
                appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
                appEl2 = <HTMLElement>(document.getElementsByTagName('BODY')[0]),
                // appElHeight = appEl.clientHeight,
                appElHeight2 = appEl2.clientHeight;
            this.onKeyboardShowSubscription = this.keyboard.onKeyboardShow()
                .subscribe(() => {
                    console.log('signup open')
                    appEl.style.height = (appElHeight2 - (appElHeight2 / 3)) + 'px';
                    this.content.scrollToBottom();
                })

            this.onKeyboardHideSubscription = this.keyboard.onKeyboardHide()
                .subscribe(() => {
                    //window.alert(appElHeight)
                    //window.alert(appElHeight2)
                    // console.log('signup hide')
                    appEl.style.height = (appElHeight2) + 'px';
                })
        }

        this.envName = this.appMode.getEnvironmentMode();
        this.formData.code = this.storage.get('invCode') ? this.storage.get('invCode') : '';
        this.numCode = this.getNumCode();
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
                        this.numCode = PHONE_CODES.find(item => item.code === 'US');
                        return this.numCode;
                    })

        }
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getCode() {
        // this.analytics.trackEvent("Session", 'event_signup');
        this.phoneNumber = this.numCode.dial_code + this.formData.phone;
        // let inviteCode = this.auth.getInviteCode();
        let inviteCode: string;
        if (this.envName === 'prod') {
            inviteCode = this.formData.code && this.formData.code !== ''
                ? this.formData.code
                : 'NAU';
        }
        else {
            inviteCode = this.formData.code;
        }
        this.oneSignal.sendTag('refferalInviteCode', inviteCode);
        this.auth.getReferrerId(inviteCode, this.phoneNumber)
            .subscribe(resp => {
                let register: Register = {
                    phone: resp.phone,
                    code: '',
                    referrer_id: resp.referrer_id,
                }
                this.nav.push(SignUpCodePage, { register: register, inviteCode: inviteCode, social: this.socialData });
                // this.nav.push(SignUpCodePage, { register: resp })
            })
    }

    limitStr(str: string, length: number) {
        this.formData.phone = StringValidator.stringLimitMax(str, length);
    }

    getDevMode() {
        return (this.envName === 'dev' || this.envName === 'test');
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

    loadUrl(url) {
        this.browser.create(url, '_system');
    }

    ionViewDidLeave() {
        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription.unsubscribe();
            this.onKeyboardHideSubscription.unsubscribe();
        }
    }

}

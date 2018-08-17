import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { Content, NavController, NavParams, Platform, Select } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { Register } from '../../models/register';
import { SocialData } from '../../models/socialData';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { LocationService } from '../../providers/location.service';
import { StorageService } from '../../providers/storage.service';
import { StringValidator } from '../../validators/string.validator';
import { SignUpCodePage } from '../signup-code/signup-code';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})

// this page is not used

export class SignUpPage {
    formData = {
        phone: '',
        code: ''
    };
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
        private navParams: NavParams) {

        this.envName = this.appMode.getEnvironmentMode();
        this.formData.code = this.storage.get('invCode') ? this.storage.get('invCode') : '';
        this.socialData = this.navParams.get('social');
        this.numCode = this.navParams.get('numCode') ? this.navParams.get('numCode') : this.getNumCode(); 
        this.formData.phone = this.navParams.get('phone') ? this.navParams.get('phone') : '';

        if (this.platform.is('android')) {
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
                    appEl.style.height = (appElHeight2) + 'px';
                })
        }

    }

    getNumCode() {
        if (this.getDevMode()) {
            this.numCode = this.phoneCodes.find(item => item.dial_code === '+380');
            return this.numCode;
        } else {
            this.location.getByIp()
                .subscribe(resp => {
                    // this.numCode = this.phoneCodes.find(item => item.code === resp.country_code);
                    this.numCode = this.phoneCodes.find(item => item.code === resp.countryCode);
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
        let phoneNumber = this.numCode.dial_code + this.formData.phone;

        let defaultInvite = this.envName === 'prod' ? 'nau'
            : this.envName === 'test' ? '5a4' : '59c';
        let inviteCode = this.formData.code && this.formData.code !== '' ? this.formData.code : defaultInvite;
        this.auth.getReferrerId(inviteCode, phoneNumber)
            .subscribe(resp => {
                let register: Register = {
                    phone: resp.phone,
                    code: '',
                    referrer_id: resp.referrer_id,
                }
                this.nav.push(SignUpCodePage, { register: register, inviteCode: inviteCode, social: this.socialData });
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

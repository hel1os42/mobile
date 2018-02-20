import { AppModeService } from '../../providers/appMode.service';
import { Register } from '../../models/register';
import { StringValidator } from '../../validators/string.validator';
import { Component, ViewChild } from '@angular/core';
import { NavController, Select, Platform, Content } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { StorageService } from '../../providers/storage.service';
import { LocationService } from '../../providers/location.service';
import { Subscription } from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    formData = {
        phone: '',
        code: ''
    };
    //numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    phoneNumber: string;
    phoneCodes = PHONE_CODES;
    numCode = PHONE_CODES.find(item => item.code === 'US');
    envName: string;
    onKeyboardShowSubscription: Subscription;
    // onKeyboardHideSubscription: Subscript

    @ViewChild('codeSelect') codeSelect: Select;
    @ViewChild(Content) content: Content;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private storage: StorageService,
        private location: LocationService,
        private keyboard: Keyboard) {

        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription = this.keyboard.onKeyboardShow()
                .subscribe((resp) => {
                    this.content.scrollTo(1, resp.keyboardHeight - 30);
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
        this.phoneNumber = this.numCode.dial_code + this.formData.phone;
        // let inviteCode = this.auth.getInviteCode();
        let inviteCode = this.formData.code;
        this.auth.getReferrerId(inviteCode, this.phoneNumber)
            .subscribe(resp => {
                let register: Register = {
                    phone: resp.phone,
                    code: '',
                    referrer_id: resp.referrer_id,
                }
                this.nav.push(SignUpCodePage, { register: register });
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

    ionViewDidLeave() {
        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription.unsubscribe();
        }
    }

}

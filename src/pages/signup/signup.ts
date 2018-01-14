import { AppModeService } from '../../providers/appMode.service';
import { Register } from '../../models/register';
import { StringValidator } from '../../validators/string.validator';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';
import { PHONE_CODES } from '../../const/phoneCodes.const';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    formData = { phone: '' };
    //numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    numCode: string;
    phoneNumber: string;
    phoneCodes = PHONE_CODES;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService) {

        this.numCode = this.phoneCodes[0].dial_code;
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getCode() {
        this.phoneNumber = this.numCode + this.formData.phone;
        let inviteCode = this.auth.getInviteCode();

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
        return this.appMode.getEnvironmentMode() === 'dev';
    }
}

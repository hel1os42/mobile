import { Register } from '../../models/register';
import { StringValidator } from '../../validators/string.validator';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    formData = { phone: '' };
    numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    numCode: string = '+380';
    phoneNumber: string;

    constructor(
        private nav: NavController,
        private auth: AuthService) {
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
}

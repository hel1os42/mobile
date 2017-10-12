import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    phone: string;
    numCodes = ['+7', '+49', '+63', '+57', '+380'];
    numCode: string = '+380';
    phoneNumber: string;

    constructor(
        private nav: NavController,
        private auth: AuthService) {
    }

    getCode(phone) {
        this.phoneNumber = this.numCode + this.phone;                
        let inviteCode = this.auth.getInviteCode();

        this.auth.getReferrerId(inviteCode, this.phoneNumber)
            .subscribe(register => {
                this.nav.push(SignUpCodePage, { register: register });
            })
    }
}
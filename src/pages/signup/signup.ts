import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { SignUpCodePage } from "../signup-code/signup-code";

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    phone: string;

    constructor(
        private nav: NavController,
        private auth: AuthService) {
    }

    getCode() {
        this.auth.checkPhone(this.phone)
            .subscribe(res => {
                this.nav.push(SignUpCodePage);
            });
    }
}
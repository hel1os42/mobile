import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})
export class StartPage {
    constructor(
        private nav: NavController) {
    }

    login() {
        this.nav.push(LoginPage);
    }

    register() {
        this.nav.push(SignUpPage);
    }
}

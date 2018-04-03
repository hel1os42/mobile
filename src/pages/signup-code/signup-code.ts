import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Register } from '../../models/register';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { StringValidator } from '../../validators/string.validator';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-signup-code',
    templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
    register: Register;
    envName: string;
    countDown;
    counter = 60;
    tick = 1000;
    timer;
    isRetry = false;
    inviteCode: string;


    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private analytics: GoogleAnalytics) {

        this.register = this.navParams.get('register');
        this.inviteCode = this.navParams.get('inviteCode');
        this.envName = this.appMode.getEnvironmentMode();
        if (this.envName === 'dev' || this.envName === 'test') {
            this.register.code = this.register.phone.slice(-4);
        }

    }

    ionViewDidLoad() {
        this.countTime()
    }

    countTime() {
        this.countDown = Observable.timer(0, this.tick)
        .take(this.counter)
        .map(() => --this.counter);
    this.timer = setInterval(() => {
        if (this.counter < 1) {
            this.cancelTimer();
            this.isRetry = true;
        }
    }, 1000);
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

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    signUp() {
        this.auth.register(this.register)
            .subscribe(resp => {
                this.auth
                    .login({
                        phone: this.register.phone,
                        code: this.register.code
                    })
                    .subscribe(res => {
                        this.analytics.trackEvent("Session", 'event_phoneconfirm');
                        this.cancelTimer();
                        this.isRetry = false;
                        this.nav.setRoot(TabsPage, { index: 0 });
                        // this.nav.setRoot(CreateUserProfilePage);
                    })
            })
    }

    getOtp() {
        this.auth.getReferrerId(this.inviteCode, this.register.phone)
            .subscribe(resp => {
                this.cancelTimer();
                this.isRetry = false;
                this.countTime();
            })
    }

    limitStr(str: string) {
        this.register.code = StringValidator.stringLimitMax(str, 6);
    }

}

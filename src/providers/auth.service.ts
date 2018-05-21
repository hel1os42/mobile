import { EventEmitter, Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';
import { Login } from '../models/login';
import { PushTokenCreate } from '../models/pushTokenCreate';
import { Register } from '../models/register';
import { User } from '../models/user';
import { AnalyticsService } from './analytics.service';
import { ApiService } from './api.service';
import { AppModeService } from './appMode.service';
import { ProfileService } from './profile.service';
import { PushTokenService } from './pushToken.service';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';
import { SocialIdentity } from '../models/socialIdentity';
import { Observable } from 'rxjs';

declare var cookieMaster;

@Injectable()
export class AuthService {

    inviteCode: string = '';
    registerData: Register = new Register();
    onLogout = new EventEmitter();

    constructor(
        private api: ApiService,
        private token: TokenService,
        private gAnalytics: GoogleAnalytics,
        private analytics: AnalyticsService,
        private storage: StorageService,
        private oneSignal: OneSignal,
        private pushToken: PushTokenService,
        private platform: Platform,
        private appMode: AppModeService,
        private profile: ProfileService) {

        this.token.onRemove.subscribe(() => this.onLogout.emit());

        setInterval(() => {
            this.clearCookies();
            let date = new Date();
            let time = date.valueOf();
            let tokenStart = this.storage.get('tokenStart');
            let differ = (time - tokenStart) / 1000;//seconds
            if (differ > 129600 && this.isLoggedIn()) {//36 hours
                this.refreshToken();
            }
        }, 120 * 1000);

    }

    getInviteCode() {
        //this.inviteCode = to do
        return this.inviteCode;
    }

    setInviteCode(invite) {
        this.inviteCode = invite;//to do
    }

    isLoggedIn() {
        let token = this.token.get();
        return !!token;
    }

    getReferrerId(inviteCode: string, phone?: string) {
        this.oneSignal.sendTag('refferalInviteCode', inviteCode);
        let obs;
        if (phone) {
            obs = this.api.get(`auth/register/${inviteCode}/${phone}/code`);
        }
        else {
            obs = this.api.get(`auth/register/${inviteCode}`);
        }
        return obs;
    }

    getOtp(phone: string) {
        return this.api.get(`auth/login/${phone}/code`, {
            showLoading: false,
            ignoreHttpNotFound: this.appMode.getEnvironmentMode() === 'prod'
        });
    }

    register(register: Register) {
        let obs = this.api.post('users', register);
        obs.subscribe((resp) => {
            if (resp.was_recently_created) {
                this.gAnalytics.trackEvent("Session", 'event_signup');
                this.analytics.faLogEvent('event_signup');
            }
            this.loginHandler({ token: resp.token }, false, resp.id);
        });
        return obs;
    }

    login(login: Login) {
        this.gAnalytics.trackEvent("Session", 'event_phoneconfirm');
        this.analytics.faLogEvent('event_phoneconfirm');
        this.clearCookies();
        let obs = this.api.post('auth/login', login);
        obs.subscribe(token => {
            this.loginHandler(token, false);
            //     this.token.set(token);
            //     this.oneSignal.getIds()
            //         .then(resp => {
            //             this.profile.get(false, false)//for sending one signal tags
            //                 .subscribe((user: User) => {
            //                     let pushToken: PushTokenCreate = {
            //                         user_id: user.id,
            //                         token: resp.pushToken
            //                     };
            //                     // this.pushToken.get(resp.userId)
            //                     //     .subscribe(res => { },
            //                     //         err => {
            //                     //             if (err.status == 404) {
            //                     this.pushToken.set(pushToken, resp.userId);
            //                     //     }
            //                     // })
            //                 })
            //         })
            //     if (isAnalitics) {
            //         this.gAnalytics.trackEvent("Session", "Login", new Date().toISOString());
            //     }
            //     let envName = this.appMode.getEnvironmentMode();
            //     if (this.platform.is('cordova')) {
            //         this.oneSignal.sendTag('environment', envName);
            //     }
        });
        return obs;
    }

    loginHandler(token, isSocial: boolean, userId?: string) {
        this.token.set(token);
        this.oneSignal.getIds()
            .then(resp => {
                let obs = userId ? Observable.of({ id: userId }) : this.profile.get(false, false);//for sending one signal tags
                obs.subscribe((user: User) => {
                    let pushToken: PushTokenCreate = {
                        user_id: user.id,
                        token: resp.pushToken
                    };
                    // this.pushToken.get(resp.userId)
                    //     .subscribe(res => { },
                    //         err => {
                    //             if (err.status == 404) {
                    this.pushToken.set(pushToken, resp.userId);
                    //     }
                    // })
                })
            })
        this.gAnalytics.trackEvent("Session", 'event_signin');
        // this.gAnalytics.trackEvent("Session", "Login", new Date().toISOString());
        let envName = this.appMode.getEnvironmentMode();
        if (this.platform.is('cordova')) {
            this.oneSignal.sendTag('environment', envName);
        }
        if (!isSocial) {
            this.gAnalytics.trackEvent("Session", 'event_phoneconfirm');
            this.analytics.faLogEvent('event_phoneconfirm');
        }
    }

    loginViaSocial(identity: SocialIdentity) {
        this.clearCookies();
        let obs = this.api.post('auth/login', identity);
        obs.subscribe(token => {
            this.loginHandler(token, true);
        });
        return obs;
    }

    logout() {
        this.clearCookies();
        this.token.remove('LOGOUT');
    }

    clearCookies() {
        if (typeof cookieMaster !== 'undefined')
            cookieMaster.clearCookies();
    }

    refreshToken() {
        this.api.get('auth/token', { showLoading: false })
            .subscribe(
                token => this.token.set(token),
                errResp => {
                    this.token.remove('ERR_RESP_TOKEN_REFRESH');
                });
    }

}

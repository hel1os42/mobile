import { Injectable, EventEmitter } from '@angular/core';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StorageService } from './storage.service';
import { OneSignal } from '@ionic-native/onesignal';
import { PushTokenCreate } from '../models/pushTokenCreate';
import { PushTokenService } from './pushToken.service';
import { FlurryAnalytics, FlurryAnalyticsOptions, FlurryAnalyticsObject } from '@ionic-native/flurry-analytics';
import { Platform } from 'ionic-angular';

declare var cookieMaster;

@Injectable()
export class AuthService {

    inviteCode: string = '';
    registerData: Register = new Register();
    onLogout = new EventEmitter();
    fa: FlurryAnalyticsObject;

    constructor(
        private api: ApiService,
        private token: TokenService,
        private gAnalytics: GoogleAnalytics,
        private fAnalytics: FlurryAnalytics,
        private storage: StorageService,
        private oneSignal: OneSignal,
        private pushToken: PushTokenService,
        private platform: Platform
    ) {

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

        let appKey: string;
        if (this.platform.is('android')) {
            appKey = 'WGQND43HCBMFK3Y4Y7X4';
        }
        else if (this.platform.is('ios')) {
            appKey = 'XXCDHNFF247F7SDQQFC4';
        }
        const options: FlurryAnalyticsOptions = {
            appKey: appKey,
            reportSessionsOnClose: true,
            enableLogging: true
        };
        this.fa = this.fAnalytics.create(options);
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

    getReferrerId(inviteCode: string, phone: string) {
        this.gAnalytics.trackEvent("Session", 'event_signup');
        return this.api.get(`auth/register/${inviteCode}/${phone}/code`);
    }

    getOtp(phone: string) {
        return this.api.get(`auth/login/${phone}/code`)
    }

    register(register: Register) {
        let obs = this.api.post('users', register);
        obs.subscribe(() => {
            this.fa.logEvent('event_signup');
        })
        return this.api.post('users', register);
    }

    login(login: Login, isAnalitics: boolean) {
        this.gAnalytics.trackEvent("Session", 'event_phoneconfirm');
        this.fa.logEvent('event_phoneconfirm');
        this.clearCookies();
        let obs = this.api.post('auth/login', login);
        obs.subscribe(token => {
            this.token.set(token);
            this.oneSignal.getIds()
                .then(resp => {
                    let pushToken: PushTokenCreate = {
                        device_id: resp.userId,
                        token: resp.pushToken
                    };
                    this.pushToken.get(resp.userId)
                        .subscribe(resp => { },
                            err => {
                                if (err.status == 404) {
                                    this.pushToken.post(pushToken);
                                }
                            })
                })
            if (isAnalitics) {
                this.gAnalytics.trackEvent("Session", "Login", new Date().toISOString());
            }
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

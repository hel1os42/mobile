import { Injectable, EventEmitter } from '@angular/core';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StorageService } from './storage.service';

declare var cookieMaster;

@Injectable()
export class AuthService {

    inviteCode: string = '';
    registerData: Register = new Register();

    onLogout = new EventEmitter();

    constructor(
        private api: ApiService,
        private token: TokenService,
        private analytics: GoogleAnalytics,
        private storage: StorageService) {

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

    getReferrerId(inviteCode: string, phone: string) {
        return this.api.get(`auth/register/${inviteCode}/${phone}/code`);
    }

    getOtp(phone: string) {
        return this.api.get(`auth/login/${phone}/code`)
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        this.clearCookies();
        let obs = this.api.post('auth/login', login);
        obs.subscribe(token => this.token.set(token));
        this.analytics.trackEvent("Session", "Login", new Date().toISOString());
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

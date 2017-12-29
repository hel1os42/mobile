import { Injectable, EventEmitter } from '@angular/core';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

declare var cookieMaster;

@Injectable()
export class AuthService {

    inviteCode: string = '';
    registerData: Register = new Register();

    onLogout = new EventEmitter();

    constructor(
        private api: ApiService,
        private token: TokenService) {

        this.token.onRemove.subscribe(() => this.onLogout.emit());

        setInterval(() => {
            this.clearCookies();
            if (this.isLoggedIn()) {
                this.api.get('auth/token', { showLoading: false })
                    .subscribe(
                        token => this.token.set(token),
                        errResp => {
                            this.token.remove();
                        });
            }
        }, 1800 * 1000);  //every 5 min
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
        return obs;
    }

    logout() {
        this.clearCookies();
        this.token.remove();
    }

    clearCookies() {
        if (typeof cookieMaster !== 'undefined')
            cookieMaster.clearCookies();
    }
}

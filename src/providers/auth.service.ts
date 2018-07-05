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
import { AdjustService } from './adjust.service';

declare var cookieMaster;

@Injectable()
export class AuthService {

    inviteCode: string = '';
    registerData: Register = new Register();
    onLogout = new EventEmitter();
    FACEBOOK = 'facebook';
    TWITTER = 'twitter';
    INSTAGRAM = 'instagram';
    VK = 'vk';
    PROVIDERS_NAMES = [
        this.FACEBOOK,
        this.TWITTER,
        this.INSTAGRAM,
        this.VK
    ];

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
        private profile: ProfileService,
        private adjust: AdjustService) {

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
        if (this.platform.is('cordova')) {
            this.oneSignal.sendTag('refferalInviteCode', inviteCode);
        }
        let obs: Observable<any>;
        if (phone) {
            obs = this.api.get(`auth/register/${inviteCode}/${phone}/code`);
            obs.subscribe(() => this.adjust.setEvent('SMS_INITIALIZE'),
                err => { return; });
        }
        else {
            obs = this.api.get(`auth/register/${inviteCode}`, { showLoading: false });
        }
        return obs;
    }

    getOtp(phone: string) {
        let obs = this.api.get(`auth/login/${phone}/code`, {
            showLoading: false,
            ignoreHttpNotFound: this.appMode.getEnvironmentMode() === 'prod'
        });
        obs.subscribe(() => this.adjust.setEvent('SMS_INITIALIZE'),
            err => { return; });
        return obs;
    }

    register(register: Register) {
        let obs = this.api.post('users', register);
        obs.subscribe((resp) => {
            if (resp.was_recently_created) {
                this.gAnalytics.trackEvent('Session', 'event_signup');
                this.analytics.faLogEvent('event_signup');
                this.adjust.setEvent('FIRST_TIME_SIGN_IN');
            }
            if (!resp.was_recently_created) {
                this.adjust.setEvent('SIGN_IN');
            }
            if (register.identity_provider) {
                this.PROVIDERS_NAMES.forEach(name => {
                    if (name === register.identity_provider) {// to add INSTAGRAM
                        let event = name.toUpperCase() + '_LINK';
                        this.adjust.setEvent(event);
                    }
                })
            }
            this.loginHandler({ token: resp.token }, false, resp.id);
        });
        return obs;
    }

    login(login: Login) {
        this.gAnalytics.trackEvent('Session', 'event_phoneconfirm');
        this.analytics.faLogEvent('event_phoneconfirm');
        this.clearCookies();
        let obs = this.api.post('auth/login', login);
        obs.subscribe(token => {
            this.loginHandler(token, false);
            this.adjust.setEvent('SIGN_IN');
        });
        return obs;
    }

    loginHandler(token, isSocial: boolean, userId?: string) {
        this.token.set(token);
        if (this.platform.is('cordova')) {
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
            this.gAnalytics.trackEvent('Session', 'event_signin');
            // this.gAnalytics.trackEvent("Session", "Login", new Date().toISOString());
            let envName = this.appMode.getEnvironmentMode();
            this.oneSignal.sendTag('environment', envName);
            if (!isSocial) {
                this.gAnalytics.trackEvent("Session", 'event_phoneconfirm');
                this.analytics.faLogEvent('event_phoneconfirm');
            }
        }
    }

    loginViaSocial(identity: SocialIdentity) {
        this.clearCookies();
        let obs = this.api.post('auth/login', identity, {
            ignoreHttpNotFound: this.appMode.getEnvironmentMode() === 'prod'
        });
        obs.subscribe(token => {
            this.loginHandler(token, true);
            this.adjust.setEvent('SIGN_IN');
            this.PROVIDERS_NAMES.forEach(name => {
                if (name === identity.identity_provider) {// to add INSTAGRAM
                    let event = name.toUpperCase() + '_SIGN_IN';
                    this.adjust.setEvent(event);
                }
            })
        },
            err => {
                return;
            });
        return obs;
    }

    logout() {
        this.clearCookies();
        this.token.remove('LOGOUT');
        this.adjust.setEvent('LOGOUT_BUTTON_CLICK');
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

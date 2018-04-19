import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';

@Injectable()
export class ProfileService {
    user: User;
    onRefreshAccounts: EventEmitter<User> = new EventEmitter<User>();
    onRefresh: EventEmitter<User> = new EventEmitter<User>();

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private oneSignal: OneSignal,
        private platform: Platform) {

        this.auth.onLogout.subscribe(() => this.user = undefined);
    }

    get(forceReload: boolean, showLoading?: boolean) {
        if (forceReload || !this.user) {
            let obs = this.api.get('profile', { showLoading: showLoading });
            obs.subscribe(user => {
                if (this.platform.is('cordova') 
                && (!this.user || this.user.name !== user.name || this.user.phone !== user.phone || this.user.email !== user.email)) {
                    this.sendTags(user);
                }
                this.user = user;
                this.onRefresh.emit(user);
            });
            return obs;
        }
        else {
            return Observable.of(this.user);
        }
    }

    getReferrals(page) {
        return this.api.get(`profile/referrals?page=${page}`, {
            showLoading: page == 1
        });
    }

    getWithAccounts(showLoading?: boolean) {
        return this.api.get('profile?with=accounts', { showLoading: showLoading });
    }

    put(data) {
        return this.api.put('profile', data);
    }

    patch(data, isNoShowLoading?: boolean, gender?: string) {//temporary parametr "gender"
        let obs = this.api.patch('profile', data, { showLoading: !isNoShowLoading });
        obs.subscribe(resp => {
            if (this.platform.is('cordova') 
            && (!this.user || this.user.name !== resp.name || this.user.phone !== resp.phone || this.user.email !== resp.email)) {
                this.sendTags(resp, gender);
            }
            this.user = resp;
        })
        return obs;
    }

    refreshAccounts(isLoading?) {
        this.getWithAccounts(isLoading).subscribe(user => this.onRefreshAccounts.emit(user));
    }

    sendTags(user: User, gender?: string) {//temporary parametr "gender"
        let tagObj: any = {
            userName: user.name,
            userPhone: user.phone.split('+')[1],
            userEmail: user.email
        };
        if (gender && gender !== '') {
            tagObj.gender = gender;
        }
        // this.oneSignal.sendTags({
        //     'userName': user.name,
        //     'userPhone': user.phone.split('+')[1],
        //     'userEmail': user.email
        // });
        this.oneSignal.sendTags(tagObj);
        // this.oneSignal.syncHashedEmail(user.email);
        if (this.platform.is('cordova')) {
            window['plugins'].OneSignal.setEmail(user.email);
        }
    }

}
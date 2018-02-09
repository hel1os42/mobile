import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable()
export class ProfileService {
    user: User;
    onRefreshAccounts: EventEmitter<User> = new EventEmitter<User>();

    constructor(
        private api: ApiService,
        private auth: AuthService) {

        this.auth.onLogout.subscribe(() => this.user = undefined);
    }

    get(forceReload: boolean, showLoading?: boolean) {
        if (forceReload || !this.user) {
            let obs = this.api.get('profile', { showLoading: showLoading });
            obs.subscribe(user => this.user = user);
            return obs;
        }
        else {
            return Observable.of(this.user);
        }
    }

    getReferrals(page) {
        return this.api.get(`profile/referrals/?page=${page}`, {
            showLoading: page == 1
        });
    }

    getWithAccounts(showLoading?: boolean) {
        return this.api.get('profile?with=accounts', { showLoading: showLoading });
    }

    put(data) {
        return this.api.put('profile', data);
    }
    
    patch(data) {
        return this.api.patch('profile', data);
    }

    refreshAccounts() {
        this.getWithAccounts().subscribe(user => this.onRefreshAccounts.emit(user));
    }

}
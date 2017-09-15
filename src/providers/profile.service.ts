import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { StorageService } from './storage.service';
import { User } from '../models/user';

@Injectable()
export class ProfileService {
    user: User = new User();

    constructor(private api: ApiService,
        private storage: StorageService) { }

    get() {
        return this.api.get('profile');
    }

    set(account: User) {
        this.user = account;//to do
        return Observable.of({ success: true });
        //this.api.post('', account);
    }

    getReferrals() {
        return this.api.get('profile/referrals');
    }


    getTransactions() {
        return this.api.get('transactions');
    }

    getAccounts() {
        return this.api.get('profile?with=accounts');
    }

    isOnboardingShown() {
        let isSwown: boolean = this.storage.get('shownOnboarding');
        return isSwown;
    }
}
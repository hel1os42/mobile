import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { UserAccount } from "../models/userAccount";
import { StorageService } from './storage.service';

@Injectable()
export class ProfileService {
    userAccount: UserAccount = new UserAccount();
    ADV_MODE_KEY = "isAdvMode";

    constructor(private api: ApiService,
        private storage: StorageService) { }

    get() {
        return this.api.get('profile');
    }

    set(account: UserAccount) {
        this.userAccount = account;//to do
        return Observable.of({ success: true });
        //this.api.post('', account);
    }

    getReferrals() {
        return this.api.get('profile/referrals');
    }

    getMode() {
        let advMode: boolean = this.storage.get(this.ADV_MODE_KEY)
        return advMode;
    }

    setMode(advMode) {
        this.storage.set(this.ADV_MODE_KEY, advMode);
    }

    isOnboardingShown() {
        let isSwown: boolean = this.storage.get('shownOnboarding');
        return isSwown;
    }
}
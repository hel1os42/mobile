import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { User } from '../models/user';

@Injectable()
export class ProfileService {
    user: User = new User();

    constructor(private api: ApiService) { }

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
        return this.api.get('transactions?orderBy=created_at&sortedBy=desc');
    }

    getWithAccounts() {
        return this.api.get('profile?with=accounts');
    }

    put(user: User) {
        return this.api.put('profile', user);
    }

}
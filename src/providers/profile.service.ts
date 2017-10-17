import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { User } from '../models/user';

@Injectable()
export class ProfileService {
    constructor(private api: ApiService) { }

    get() {
        return this.api.get('profile');
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
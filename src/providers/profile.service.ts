import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { TransactionCreate } from '../models/transactionCreate';

@Injectable()
export class ProfileService {
    user: User;
    onRefreshAccounts: EventEmitter<User> = new EventEmitter<User>();
    onRefreshTransactions: EventEmitter<any> = new EventEmitter<any>();

    constructor(private api: ApiService,
        private auth: AuthService) {

        this.auth.onLogout.subscribe(() => this.user = undefined);
    }

    get(forceReload: boolean) {
        if (forceReload || !this.user) {
            let obs = this.api.get('profile');
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

    getTransactions(page) {
        return this.api.get(`transactions?orderBy=created_at&sortedBy=desc&page=${page}`, {
            showLoading: page == 1
        });
    }

    postTransaction(transaction: TransactionCreate, showLoading?: boolean) {
        return this.api.post('transactions', transaction, { showLoading: showLoading });
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

    refreshTransactions() {
        this.getTransactions(1).subscribe(transactions => this.onRefreshTransactions.emit(transactions));
    }
}
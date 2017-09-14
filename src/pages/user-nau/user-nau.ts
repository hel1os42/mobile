import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Transaction } from '../../models/transaction';
import { ProfileService } from '../../providers/profile.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'page-user-nau',
    templateUrl: 'user-nau.html'
})
export class UserNauPage {

    transactions: Transaction[];
    balance: number;
    today: number = Date.now();

    constructor(
        private nav: NavController,
        private profile: ProfileService) {

    }

    ionViewDidLoad() {
        this.profile.getTransactions()
            .subscribe(resp => this.transactions = resp.data)

        let accounts;
        this.profile.getAccounts()
            .subscribe(resp => {
                accounts = resp.accounts;
                this.balance = accounts.map(account => account.balance).reduce((sum, amount) => sum + amount);
            })
    }

}
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';
import { ProfileService } from '../../providers/profile.service';
import { TransferPage } from '../transfer/transfer';

@Component({
    selector: 'page-user-nau',
    templateUrl: 'user-nau.html'
})
export class UserNauPage {

    transactions: Transaction[];
    balance: number;
    today: number = Date.now();
    date: string;
    page = 1;
    lastPage: number;
    NAU: Account;

    constructor(
        private profile: ProfileService,
        private navParams: NavParams,
        private nav: NavController) {
       
        this.NAU = this.navParams.get('NAU');
        this.balance = this.NAU.balance; 

        this.profile.getTransactions(this.page)
            .subscribe(resp => {
                this.transactions = resp.data;
                this.lastPage = resp.last_page;
            });
    }

    transactionSource(sourceId, transactionAmount) {
        let amount = (this.NAU.id == sourceId) ? -transactionAmount : transactionAmount;
        return amount;
    }

    filterByDate() {
        // let dates = DateTimeUtils.getFilterDates(this.date);
        //to do
    }

    openTransfer() {
        this.nav.push(TransferPage, { NAU: this.NAU });
    }

    doInfinite(infiniteScroll) {
        this.page = this.page + 1;
        if (this.page <= this.lastPage) {
            setTimeout(() => {
                this.profile.getTransactions(this.page)
                    .subscribe(resp => {
                        this.transactions = [...this.transactions, ...resp.data];
                        infiniteScroll.complete();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }
}

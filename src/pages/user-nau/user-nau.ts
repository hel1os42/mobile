import { Account } from '../../models/account';
import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { Transaction } from '../../models/transaction';
import { ProfileService } from '../../providers/profile.service';
import { DateTimeUtils } from '../../utils/date-time.utils';

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
        private navParams: NavParams) {
       
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
        let dates = DateTimeUtils.getFilterDates(this.date);
        //to do
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

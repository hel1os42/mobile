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
    NAU_Id: string;
    date: string;
    page = 1;
    lastPage: number;


    constructor(
        private profile: ProfileService,
        private navParams: NavParams) {

        this.balance = this.navParams.get('balance');
        this.NAU_Id = this.navParams.get('NAU_Id');

        this.profile.getTransactions(this.page)
            .subscribe(resp => {
                this.transactions = resp.data;
                this.lastPage = resp.last_page;
            });
    }

    transactionSource(sourceId, transactionAmount) {
        let amount = (this.NAU_Id == sourceId) ? -transactionAmount : transactionAmount;
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
                        for (let i = 0; i < resp.data.length; i++) {
                            this.transactions.push(resp.data[i]);
                        }
                        infiniteScroll.complete();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }
}

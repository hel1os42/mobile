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

    constructor(
        private profile: ProfileService,
        private navParams: NavParams) {

        this.balance = this.navParams.get('balance');
        this.NAU_Id = this.navParams.get('NAU_Id');

        this.profile.getTransactions()
            .subscribe(resp => this.transactions = resp.data);
    }

    transactionSource(sourceId, transactionAmount) {
        let amount = (this.NAU_Id == sourceId) ? -transactionAmount : transactionAmount;
        return amount;
    }

    filterByDate() {
        let dates = DateTimeUtils.getFilterDates(this.date);
        //to do
    }
}

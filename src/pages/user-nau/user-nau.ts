import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { Transaction } from '../../models/transaction';
import { ProfileService } from '../../providers/profile.service';

@Component({
    selector: 'page-user-nau',
    templateUrl: 'user-nau.html'
})
export class UserNauPage {

    transactions: Transaction[];
    balance: number;
    today: number = Date.now();
    NAU_Id: string;

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

    showCalendar() {
        // this.datePicker.show({
        //     date: new Date(),
        //     mode: 'date',
        //     androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        //     }).then(
        //     date => console.log('Got date: ', date),
        //     err => console.log('Error occurred while getting date: ', err)
        // );
   }
}

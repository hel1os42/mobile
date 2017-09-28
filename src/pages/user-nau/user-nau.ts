import { Component } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
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
        private profile: ProfileService,
        private navParams: NavParams) {
        
        this.balance = this.navParams.get('balance');
    }

    ionViewDidLoad() {
        this.profile.getTransactions()
            .subscribe(resp => this.transactions = resp.data);
    }
}
import { NavParams } from 'ionic-angular';
import { ProfileService } from '../../providers/profile.service';
import { TransactionCreate } from '../../models/transactionCreate';
import { Component } from '@angular/core';
import { Account } from '../../models/account';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {

    NAU: Account;
    transferData: TransactionCreate;

    constructor(
        private profile: ProfileService,
        private navParams: NavParams) {

        this.NAU = this.navParams.get('NAU');
    }
}
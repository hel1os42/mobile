import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Transaction } from '../../models/transaction';
import * as _ from 'lodash';
import { ProfileService } from '../../providers/profile.service';

@Component({
    selector: 'page-user-nau',
    templateUrl: 'user-nau.html'
})
export class UserNauPage {

    transactions: Transaction[];

    constructor(
        private nav: NavController,
        private profile: ProfileService) {

    }

    ionViewDidLoad() {
        this.profile.getTransactions()
            .subscribe(resp => this.transactions = resp.data)
    }

    parse(string) {
        return string.match(/\d+/g).join("").substring(0,6);
    }
    
}
import { AppModeService } from '../../providers/appMode.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
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
    onRefreshAccounts: Subscription;
    onRefreshTransactions: Subscription;
    todayDate = new Date();

    constructor(
        private profile: ProfileService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private nav: NavController,
        private changeDetectorRef: ChangeDetectorRef) {

        this.date = this.todayDate.toISOString().slice(0, 10);
        // this.NAU = this.navParams.get('NAU');return
        this.NAU = this.appMode.getEnvironmentMode() === 'dev' ? this.navParams.get('NAU') : this.navParams.data;//temporary
        this.balance = this.NAU ? this.NAU.balance : 0;

        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            })

        this.onRefreshTransactions = this.profile.onRefreshTransactions
            .subscribe(resp => {
                this.transactions = resp.data;
                this.lastPage = resp.last_page;
                this.changeDetectorRef.detectChanges();
            });

        if (!this.transactions) {
            this.profile.getTransactions(this.page)
                .subscribe(resp => {
                    this.transactions = resp.data;
                    this.lastPage = resp.last_page;
                    this.changeDetectorRef.detectChanges();
                });
        }
    }

    //temporary
    ionSelected() {
        this.page = 1;
        this.profile.getTransactions(this.page)
            .subscribe(resp => {
                this.transactions = resp.data;
                this.lastPage = resp.last_page;
                this.changeDetectorRef.detectChanges();
            });

        this.profile.getWithAccounts()
            .subscribe((resp) => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            });
    }
    //temporary

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
                        this.changeDetectorRef.detectChanges();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }

    ionViewWillUnload() {
        this.onRefreshAccounts.unsubscribe();
        this.onRefreshTransactions.unsubscribe();
        this.profile.refreshAccounts();
    }
}

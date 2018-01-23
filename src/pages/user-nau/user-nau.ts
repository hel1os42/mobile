import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { LoadingController, NavController, NavParams, PopoverController, Content } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Rx';
import { Account } from '../../models/account';
import { TransactionCreate } from '../../models/transactionCreate';
import { AppModeService } from '../../providers/appMode.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { StringValidator } from '../../validators/string.validator';
import { TransferPopover } from './transfer.popover';

@Component({
    selector: 'page-user-nau',
    templateUrl: 'user-nau.html'
})
export class UserNauPage {
    @ViewChild(Content) content: Content;

    // transactions: Transaction[];
    transactions;
    balance: number;
    today: number = Date.now();
    date: string;
    page = 1;
    lastPage: number;
    NAU: Account;
    todayDate = new Date();
    transferData = new TransactionCreate();
    amount = '1';
    timer;
    onRefreshAccounts: Subscription;
    onRefreshTransactions: Subscription;
    isFormVisible = false;
    isTransferLoading = false;
    options: BarcodeScannerOptions = {
        preferFrontCamera: true,
        orientation: 'portrait'
    };

    constructor(
        private profile: ProfileService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private nav: NavController,
        private toast: ToastService,
        private popoverCtrl: PopoverController,
        private barcode: BarcodeScanner,
        private loading: LoadingController,
        private alert: AlertController) {

        this.date = this.todayDate.toISOString().slice(0, 10);
        // this.NAU = this.navParams.get('NAU');return
        this.NAU = this.appMode.getEnvironmentMode() === 'dev' ? this.navParams.get('NAU') : this.navParams.data;//temporary
        this.transferData.source = this.NAU.address;
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
            });

        if (!this.transactions) {
            this.profile.getTransactions(this.page)
                .subscribe(resp => {
                    this.transactions = resp.data;
                    this.lastPage = resp.last_page;
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
            });

        this.profile.getWithAccounts()
            .subscribe((resp) => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
                if (this.appMode.getEnvironmentMode() === 'dev')
                    this.nav.popToRoot();
            });
    }
    //temporary

    transactionSource(sourceId, transactionAmount) {
        let amount = (this.NAU.id == sourceId) ? -transactionAmount : transactionAmount;
        return amount;
    }

    getDate(date) {
        return moment(date).format('DD/MM/YYYY hh:mm:ss');
    }

    filterByDate() {
        // let dates = DateTimeUtils.getFilterDates(this.date);
        //to do
    }

    openTransfer() {
        let form = document.getElementsByTagName('form');
        let content = this.content.getContentDimensions();
        if (form[0]) {
             let height = form[0].clientHeight;
             if (height / 2 < content.scrollTop) {
                this.content.scrollToTop();
             }
             if (content.scrollTop < height / 2) {
                this.isFormVisible = !this.isFormVisible;
             }
        }
        else {
            if (!form[0]) {
                this.content.scrollToTop();
                this.isFormVisible = !this.isFormVisible;
            }
        }
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

    updateAmount(event) {
        StringValidator.stringAmountLimit(event);
    }

    validateMax() {
        this.transferData.amount = parseInt(this.amount);

        if (this.transferData.amount < 1) {
            this.toast.show('The amount must be at least 1');
            return false;
        }
        else {
            return true;
        }
    }

    openPopover() {
        let popover = this.popoverCtrl.create(TransferPopover, { sourceAddress: this.transferData.source });
        popover.present();
    }

    scanBarcode() {
        this.barcode.scan()
            .then(res => {
                this.transferData.destination = res.text;
            });
    }

    transfer() {
        if (this.validateMax()) {
            this.transferData.amount = parseFloat(this.amount);
            this.profile.postTransaction(this.transferData, true)
                .subscribe((resp) => {
                    let transaction = {
                        amount: undefined,
                        created_at: this.todayDate,
                        destination_account_id: resp.destination_account_id,
                        id:"Transfer process...",//to do
                        source_account_id: resp.source_account_id
                    }
                    this.transactions = [...[transaction],...this.transactions];
                    this.isTransferLoading = true;
                    this.isFormVisible = !this.isTransferLoading;
                    this.transferData.destination = undefined;
                    this.transferData.amount = 1;
                    this.timer = setInterval(() => {
                        this.profile.getWithAccounts(false)
                            .subscribe(resp => {
                                let NAU = resp.accounts.NAU;
                                let balance = NAU.balance;
                                if (this.balance != balance) {
                                    this.isTransferLoading = false;
                                    this.profile.refreshAccounts();
                                    this.profile.refreshTransactions();
                                    this.stopTimer();
                                }
                            });
                    }, 300);
                },
                (err) => {
                    this.presentAlert();
                })
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    presentAlert() {
        let alert = this.alert.create({
            title: 'Oops...ERROR',
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {

                    }
                },
            ]
        });
        alert.present();
    }

    ionViewWillUnload() {
        this.stopTimer();
        this.onRefreshAccounts.unsubscribe();
        this.onRefreshTransactions.unsubscribe();
        this.profile.refreshAccounts();
    }
}

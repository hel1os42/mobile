import { Subscription } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Account } from '../../models/account';
import { TransactionCreate } from '../../models/transactionCreate';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { StringValidator } from '../../validators/string.validator';
import { TransferPopover } from './transfer.popover';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {

    NAU: Account;
    transferData = new TransactionCreate();
    balance: number;
    amount = '1';
    options: BarcodeScannerOptions = {
        preferFrontCamera: true,
        orientation: 'portrait'
    };
    onRefreshAccounts: Subscription;
    timer;

    constructor(
        private profile: ProfileService,
        private navParams: NavParams,
        private toast: ToastService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private barcode: BarcodeScanner,
        private loading: LoadingController) {

        this.NAU = this.navParams.get('NAU');
        this.transferData.source = this.NAU.address;
        this.balance = this.NAU.balance;


        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            })

    }

    limitStr(str: string, length: number) {
        this.amount = StringValidator.stringLimitMax(str, length);
    }

    updateAmount(event) {
        StringValidator.updateAmount(event);
    }

    validateMax() {
        this.transferData.amount = parseInt(this.amount);
        // if (this.transferData.amount > this.balance) {
        //     this.toast.show('The amount should be no more then balance');
        //     return false;
        // }
        // else {
        if (this.transferData.amount < 1) {
            this.toast.show('The amount must be at least 1');
            return false;
        }
        else {
            return true;
        }
        // }
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

            let loading = this.loading.create();
            loading.present();

            this.profile.postTransaction(this.transferData, false)
                .subscribe(() => {
                    this.timer = setInterval(() => {
                        this.profile.getWithAccounts(false)
                            .subscribe(resp => {
                                let NAU = resp.accounts.NAU;
                                let balance = NAU.balance;
                                if (this.balance != balance) {
                                    this.profile.refreshAccounts();
                                    this.profile.refreshTransactions();
                                    this.stopTimer();
                                    loading.dismiss();
                                    this.nav.pop();
                                }
                            });
                    }, 500);
                })
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    ionViewWillUnload() {
        this.onRefreshAccounts.unsubscribe();
    }
}
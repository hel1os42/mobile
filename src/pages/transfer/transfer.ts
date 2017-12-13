import { StringValidator } from '../../validators/string.validator';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TransferPopover } from './transfer.popover';
import { NamberValidator } from '../../validators/number.validator';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { ProfileService } from '../../providers/profile.service';
import { TransactionCreate } from '../../models/transactionCreate';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Account } from '../../models/account';
import { ToastService } from '../../providers/toast.service';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {

    NAU: Account;
    transferData = new TransactionCreate();
    balance: number;
    amount = '1';

    constructor(
        private profile: ProfileService,
        private navParams: NavParams,
        private toast: ToastService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private barcode: BarcodeScanner) {

        this.NAU = this.navParams.get('NAU');
        this.transferData.source = this.NAU.address;
        this.balance = this.NAU.balance;

    }

    limitStr(str: string, length: number) {
        this.amount = StringValidator.stringLimitMax(str, length);
    }

    updateAmount(event) {
        StringValidator.updateAmount(event);
    }

    validateMax() {
        this.transferData.amount = parseInt(this.amount);
        if (this.transferData.amount > this.balance) {
            this.toast.show('Amount should be no more then balance');
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
            this.profile.postTransaction(this.transferData)
                .subscribe(() => {
                    this.profile.refreshAccounts();
                    this.nav.pop();
                })
        }
    }
}
import { NamberValidator } from '../../validators/number.validator';
import { NavParams, NavController } from 'ionic-angular';
import { ProfileService } from '../../providers/profile.service';
import { TransactionCreate } from '../../models/transactionCreate';
import { Component } from '@angular/core';
import { Account } from '../../models/account';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../providers/toast.service';

@Component({
    selector: 'page-transfer',
    templateUrl: 'transfer.html'
})
export class TransferPage {

    NAU: Account;
    transferData: TransactionCreate;
    sourceAddress: string;
    destinationAddress: string;
    amount: number;
    balance: number;
    formData: FormGroup;

    constructor(
        private profile: ProfileService,
        private navParams: NavParams,
        private builder: FormBuilder,
        private toast: ToastService,
        private nav: NavController) {

        this.NAU = this.navParams.get('NAU');
        this.sourceAddress = this.NAU.address;
        this.balance = this.NAU.balance;

        this.formData = this.builder.group({
            sourceAddress: new FormControl(this.sourceAddress, Validators.compose([
                Validators.required,
                Validators.minLength(20),
                Validators.pattern('^[a-zA-Z0-9]*$'),
            ])),
            destinationAddress: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(20),
                Validators.pattern('^[a-zA-Z0-9]*$'),
            ])),
            amount: new FormControl('1', Validators.compose([
                NamberValidator.min(1),
                Validators.required,
            ])),
        });
    }

    validateMax() {
        let amount = parseInt(this.formData.value.amount);
        if (amount > this.balance) {
            this.toast.show('Amount should be no more then balance');
            return false;
        }
        else {
            return true;
        }
    }

    transfer() {
        if (this.validateMax) {
            let data = this.formData.value;
            this.transferData = {
                source: data.sourceAddress,
                destination: data.destinationAddress,
                amount: parseInt(data.amount)
            };
        this.profile.postTransaction(this.transferData)
            .subscribe(() => {
                this.profile.refreshAccounts();
                this.nav.pop();
            })
        }
    }
}
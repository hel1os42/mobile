import { Company } from '../../models/company';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'congratulation-popover-component',
    templateUrl: 'congratulation.popover.html'
})

export class CongratulationPopover {

    company: Company;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

        this.company = this.navParams.get('company');
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
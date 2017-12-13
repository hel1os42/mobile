import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';

@Component({
    selector: 'transfer-popover-component',
    templateUrl: 'transfer.popover.html'
})

export class TransferPopover {

    sourceAddress: string;
    qrWith: number;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams,
                private nav: NavController) { 
        
        this.sourceAddress = this.navParams.get('sourceAddress');
        this.qrWith = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.qrWith = this.qrWith / 2;

    }

    close() {
        this.viewCtrl.dismiss();
    }

}
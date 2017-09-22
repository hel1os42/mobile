import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

@Component({
    selector: 'congratulation-popover-component',
    templateUrl: 'congratulation.popover.html'
})

export class CongratulationPopover {
    constructor(
        private viewCtrl: ViewController,
        private app: App) { }

    close() {
        this.viewCtrl.dismiss();
        this.app.getRootNav().setRoot();
    }
}
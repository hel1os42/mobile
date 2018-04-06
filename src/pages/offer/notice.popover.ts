import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'notice-popover-component',
    templateUrl: 'notice.popover.html'
})

export class NoticePopover {

    constructor(
        private viewCtrl: ViewController) {
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
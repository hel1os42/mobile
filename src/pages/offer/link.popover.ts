import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'link-popover-component',
    templateUrl: 'link.popover.html'
})

export class LinkPopover {

link;

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController) {

        this.link = this.navParams.get('link');
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
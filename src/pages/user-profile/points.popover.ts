import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'points-popover-component',
    templateUrl: 'points.popover.html'
})

export class PointsPopover {

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {

    }

    close() {
        this.viewCtrl.dismiss();
    }

}
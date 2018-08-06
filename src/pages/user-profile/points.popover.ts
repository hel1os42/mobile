import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'points-popover-component',
    templateUrl: 'points.popover.html'
})

export class PointsPopover {

    content = '';

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams) {
        
        this.content = this.navParams.get('content');
    }

    close() {
        this.viewCtrl.dismiss();
    }

}
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'timeframes-popover-component',
    templateUrl: 'timeframes.popover.html'
})

export class TimeframesPopover {

    timeFrames;
    label: string;
    day;

    constructor(
        private navParams: NavParams,
        private viewCtrl: ViewController) {
        
        this.timeFrames = this.navParams.get('timeFrames');
        this.label = this.navParams.get('label');
        this.day = this.navParams.get('day') ? this.navParams.get('day').day : '';
    }

    getKey(str) {
        return `DAYS.${str.slice(0, 3).toUpperCase()}`;
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
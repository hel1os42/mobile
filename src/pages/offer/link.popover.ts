import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'link-popover-component',
    templateUrl: 'link.popover.html'
})

export class LinkPopover {

link;

    constructor(
        private navParams: NavParams) {

        this.link = this.navParams.get('link');
    }
}
import { Component } from '@angular/core';
import { ViewController, App } from 'ionic-angular';

@Component({
    selector: 'places-popover-component',
    templateUrl: 'places.popover.html'
})

export class PlacesPopover {
    constructor(
        private viewCtrl: ViewController,
        private app: App) { }

    close() {
        this.viewCtrl.dismiss();        
    }
}
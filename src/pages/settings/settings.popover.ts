import { Component } from '@angular/core';
import { App, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'settings-popover-component',
    templateUrl: 'settings.popover.html'
})

export class SettingsPopover {

    page: any;
    latitude: number;
    longitude: number;

    constructor(
        private viewCtrl: ViewController,
        private app: App,
        private navParams: NavParams) {

        this.page = this.navParams.get('page');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');

    }

    openOnboarding() {
        // this.viewCtrl.dismiss();
        // this.app.getRootNav().setRoot(this.page, { latitude: this.latitude, longitude: this.longitude });
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
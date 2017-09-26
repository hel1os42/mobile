import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-settings-change-phone',
    templateUrl: 'settings-change-phone.html'
})
export class SettingsPageChangePhone {

    constructor(private nav: NavController) {
    }

    back() {
        this.nav.pop();
    }
}

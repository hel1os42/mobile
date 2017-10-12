import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import { OnBoardingPage } from '../onboarding/onboarding';

@Component({
    selector: 'settings-popover-component',
    templateUrl: 'settings.popover.html'
})

export class SettingsPopover {

    page: any;

    constructor(private viewCtrl: ViewController,
                private app: App,
                private navParams: NavParams) { 
        
        this.page = this.navParams.get('page');

        }

    close() {
        this.viewCtrl.dismiss();
            this.app.getRootNav().setRoot(OnBoardingPage, {page: this.page, isAdvMode: true, isAdvOnBoarding: true});
    }
}
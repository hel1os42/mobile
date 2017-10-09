import { Component } from '@angular/core';
import { ViewController, App, NavParams } from 'ionic-angular';
import { OnBoardingPage } from '../onboarding/onboarding';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';

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
        if(this.page == AdvTabsPage) { 
            this.app.getRootNav().setRoot(this.page, {index: 1});
        }
        else {
            this.app.getRootNav().setRoot(this.page);
        }
    }
}
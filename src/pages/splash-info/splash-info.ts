import { Component } from '@angular/core';
import { NavController, App } from "ionic-angular";
import { AppModeService } from '../../providers/appMode.service';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-splash-info',
    templateUrl: 'splash-info.html'
})
export class SplashInfoPage {

    constructor(private app: App,
                private appMode: AppModeService) {

    }
    
    openHome() {
        this.appMode.setHomeMode(true);
        this.app.getRootNav().setRoot(TabsPage);
    }
}
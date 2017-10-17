import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AppModeService } from '../../providers/appMode.service';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-splash-news',
    templateUrl: 'splash-news.html'
})
export class SplashNewsPage {

    constructor(private appMode: AppModeService,
                private nav: NavController) {

    }

    openHome() {
        this.appMode.setHomeMode(true);
        //this.app.getRootNav().setRoot(TabsPage);
        this.nav.setRoot(TabsPage)
    }
    
}
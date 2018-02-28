import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-splash-news',
    templateUrl: 'splash-news.html'
})
export class SplashNewsPage {

    constructor(private nav: NavController) {

    }

    openHome() {
        this.nav.setRoot(TabsPage)
    }
    
}
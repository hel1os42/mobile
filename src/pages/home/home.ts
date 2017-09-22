import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlacesPage } from '../places/places';
import { SplashScreenPage } from "../splash-screen/splash-screen";
import { AppModeService } from '../../providers/appMode.service';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(private nav: NavController,
        private appMode: AppModeService) {
    }

    getHomeMode() {
        return this.appMode.getHomeMode();
    }

    ionSelected() {
        this.appMode.setHomeMode(false);
    }    

}
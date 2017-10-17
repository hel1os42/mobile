import { Component } from '@angular/core';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-splash-info',
    templateUrl: 'splash-info.html'
})
export class SplashInfoPage {

    constructor(private appMode: AppModeService) {

    }

    openHome() {
        this.appMode.setHomeMode(true);
    }
}

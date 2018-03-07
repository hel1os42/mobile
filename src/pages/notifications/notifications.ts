import { Component } from '@angular/core';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {

    isVisibleSearch: boolean = false;
    isForkMode: boolean;

    constructor(
        private appMode: AppModeService) {

            this.isForkMode = this.appMode.getForkMode();
    }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }
    
    getDevMode() {
        return (this.appMode.getEnvironmentMode() === 'dev' || this.appMode.getEnvironmentMode() === 'test');
    }

}
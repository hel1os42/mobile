import { Component } from '@angular/core';

@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {

    isVisibleSearch: boolean = false;

    constructor() {

    }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }

}
import { Component } from '@angular/core';

@Component({
    selector: 'page-adv-notifications',
    templateUrl: 'adv-notifications.html'
})

// this page is not used

export class AdvNotificationsPage {

    isVisibleSearch: boolean = false;

    constructor() { }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }

}
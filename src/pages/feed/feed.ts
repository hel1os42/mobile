import { Component } from '@angular/core';

@Component({
    selector: 'page-feed',
    templateUrl: 'feed.html'
})
export class FeedPage {

    isVisibleSearch = false;

    constructor() {

    }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }

}

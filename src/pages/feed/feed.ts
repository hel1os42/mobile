import { Component } from '@angular/core';

@Component({
    selector: 'page-feed',
    templateUrl: 'feed.html'
})
export class FeedPage {

    isVisibleSearch = false;
    segment: string;

    constructor() {
        this.segment = 'all';
    }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-feed',
    templateUrl: 'feed.html'
})
export class FeedPage {

    isVisibleSearch = false;

    constructor(private nav: NavController) {

    }

    toggleSearch() {
        this.isVisibleSearch = !this.isVisibleSearch;
    }

}

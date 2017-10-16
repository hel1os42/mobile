import { Component } from '@angular/core';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

    segment;

  constructor() {

    this.segment = "places";
  }

}
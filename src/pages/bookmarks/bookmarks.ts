import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

    segment;

  constructor(private nav: NavController) {
    this.segment = "places";
  }

}
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {
  isVisibleSearch: boolean = false;

  constructor(private nav: NavController) {

  }

  toggleSearch() {
    this.isVisibleSearch = true;
  }

}
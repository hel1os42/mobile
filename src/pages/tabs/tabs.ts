import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { NotificationsPage } from '../notifications/notifications';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { HomePage } from '../home/home';
import { AppModeService } from '../../providers/appMode.service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = UserProfilePage;
  tab3Root = BookmarksPage;
  tab4Root = NotificationsPage;

  constructor(private nav: NavController,
    private appMode: AppModeService) {

  }
  // toggleHomeMode($event) {
  //   this.appMode.setHomeMode(false);
  // }
}
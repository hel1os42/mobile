import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomeUserPage } from '../home-user-page/home-user-page';
import { UserProfilePage } from '../user-profile/user-profile';
import { FavoritesPage } from '../favorites/favorites';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomeUserPage;
  tab2Root = UserProfilePage;
  tab3Root = FavoritesPage;
  tab4Root = NotificationsPage;

  constructor(private nav: NavController) {
        
  }

}
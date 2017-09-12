import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { FavoritesPage } from '../favorites/favorites';
import { NotificationsPage } from '../notifications/notifications';
import { SplashScreenPage } from "../splash-screen/splash-screen";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SplashScreenPage;
  tab2Root = UserProfilePage;
  tab3Root = FavoritesPage;
  tab4Root = NotificationsPage;

  constructor(private nav: NavController) {
        
  }

}
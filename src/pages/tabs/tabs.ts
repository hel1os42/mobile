import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { FavoritesPage } from '../favorites/favorites';
import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = UserPage;
  tab3Root = FavoritesPage;
  tab4Root = NotificationsPage;

  constructor(private navCtrl: NavController) {
        
  }

}
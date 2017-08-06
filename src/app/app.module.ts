import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { StartPage } from "../pages/start/start";
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';
import { FavoritesPage } from '../pages/favorites/favorites';
import { NotificationsPage } from '../pages/notifications/notifications';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    TabsPage,
    HomePage,
    UserPage,
    FavoritesPage,
    NotificationsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    TabsPage,
    HomePage,
    UserPage,
    FavoritesPage,
    NotificationsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

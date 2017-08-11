import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { StartPage } from "../pages/start/start";
import { LoginPage } from "../pages/login/login";
import { RegisterPage } from "../pages/register/register";
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { UserPage } from '../pages/user/user';
import { InvitePage } from "../pages/invite/invite";
import { FavoritesPage } from '../pages/favorites/favorites';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AuthService } from "../providers/auth.service";
import { ApiService } from "../providers/api.service";
import { StorageService } from "../providers/storage.service";
import { TokenService } from "../providers/token.service";
import { SignUpPage } from "../pages/sign-up/signup";

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    SignUpPage,
    InvitePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    UserPage,
    FavoritesPage,
    NotificationsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    SignUpPage,
    InvitePage,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    UserPage,
    FavoritesPage,
    NotificationsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    AuthService,
    StorageService,
    TokenService
  ]
})
export class AppModule {}
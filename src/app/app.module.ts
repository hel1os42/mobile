import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { StartPage } from "../pages/start/start";
import { LoginPage } from "../pages/login/login";
import { CreateUserProfilePage } from "../pages/create-user-profile/create-user-profile";
import { TabsPage } from '../pages/tabs/tabs';
import { HomeUserPage } from '../pages/home-user-page/home-user-page';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { InvitePage } from "../pages/invite/invite";
import { FavoritesPage } from '../pages/favorites/favorites';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AuthService } from "../providers/auth.service";
import { LocationService } from "../providers/location.service";
import { ApiService } from "../providers/api.service";
import { StorageService } from "../providers/storage.service";
import { TokenService } from "../providers/token.service";
import { SignUpPage } from "../pages/signup/signup";
import { SignUpCodePage } from "../pages/signup-code/signup-code";
import { OnBoardingPage } from "../pages/onboarding/onboarding";
import { ProfileService } from "../providers/profile.service";
import { CreateAdvUserProfilePage } from "../pages/create-advUser-profile/create-advUser-profile";
import { OfferService } from "../providers/offer.service";
import { CreateOfferPage } from "../pages/create-offer/create-offer";
import { SettingsPage } from "../pages/settings/settings";
import { AdvUserProfilePage } from "../pages/adv-user-profile/adv-user-profile";



@NgModule({
  declarations: [
    MyApp,
    StartPage,
    SignUpPage,
    SignUpCodePage,
    InvitePage,
    LoginPage,
    CreateUserProfilePage,
    CreateAdvUserProfilePage,
    CreateOfferPage,
    TabsPage,
    HomeUserPage,
    UserProfilePage,
    FavoritesPage,
    NotificationsPage,
    OnBoardingPage,
    SettingsPage,
    AdvUserProfilePage
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
    SignUpCodePage,
    InvitePage,
    LoginPage,
    CreateUserProfilePage,
    CreateAdvUserProfilePage,
    CreateOfferPage,
    TabsPage,
    HomeUserPage,
    UserProfilePage,
    FavoritesPage,
    NotificationsPage,
    OnBoardingPage,
    SettingsPage,
    AdvUserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    AuthService,
    StorageService,
    TokenService,
    ProfileService,
    OfferService,
    Geolocation,
    LocationService
  ]
})
export class AppModule {}

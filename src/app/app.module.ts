import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { StartPage } from "../pages/start/start";
import { LoginPage } from "../pages/login/login";
import { CreateUserProfilePage } from "../pages/create-user-profile/create-user-profile";
import { TabsPage } from '../pages/tabs/tabs';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SignUpInvitePage } from "../pages/invite/invite";
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
import { UserOffersPage } from "../pages/user-offers/user-offers";
import { OfferPage } from "../pages/offer/offer";
import { TestPage } from "../pages/test/test";
import { SplashScreenPage } from "../pages/splash-screen/splash-screen";
import { UserTasksPage } from "../pages/user-tasks/user-tasks";
import { UserAchievePage } from "../pages/user-achieve/user-achieve";
import { UserUsersPage } from "../pages/user-users/user-users";
import { UserNauPage } from "../pages/user-nau/user-nau";
import { AdvUserOffersPage } from "../pages/adv-user-offers/adv-user-offers";
import { AdvTabsPage } from "../pages/adv-tabs/adv-tabs";
import { AdvNotificationsPage } from "../pages/adv-notifications/adv-notifications";
import { AdvHomePage } from '../pages/adv-home/adv-home';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { SettingsPopover } from '../pages/settings/settings.popover';
import { CreateOfferPopover } from '../pages/create-offer/createOffer.popover';
import { AppModeService } from '../providers/appMode.service';
import { PlacesPage } from '../pages/places/places';
import { HomePage } from '../pages/home/home';
import { CreateOffer1Page } from '../pages/create-offer-1/create-offer-1';
import { PlaceFeedbackPage } from '../pages/place-feedback/place-feedback';
import { PlacePage } from '../pages/place/place';




@NgModule({
  declarations: [
    MyApp,
    StartPage,
    SignUpPage,
    SignUpCodePage,
    SignUpInvitePage,
    LoginPage,
    CreateUserProfilePage,
    CreateAdvUserProfilePage,
    CreateOfferPage,
    TabsPage,
    PlacesPage,
    UserProfilePage,
    BookmarksPage,
    NotificationsPage,
    OnBoardingPage,
    SettingsPage,
    AdvUserProfilePage,
    UserOffersPage,
    OfferPage,
    TestPage,
    SplashScreenPage,
    UserTasksPage,
    UserAchievePage,
    UserUsersPage,
    UserNauPage,
    AdvUserOffersPage,
    AdvTabsPage,
    AdvNotificationsPage,
    AdvHomePage,
    HomePage,
    CreateOffer1Page,
    PlaceFeedbackPage,
    PlacePage,
    SettingsPopover,
    CreateOfferPopover,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: "ios",
      backButtonText: "",
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBAgndAbV-v4aQWTAHrUljUfSCAthdK-RY'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    SignUpPage,
    SignUpCodePage,
    SignUpInvitePage,
    LoginPage,
    CreateUserProfilePage,
    CreateAdvUserProfilePage,
    CreateOfferPage,
    TabsPage,
    PlacesPage,
    UserProfilePage,
    BookmarksPage,
    NotificationsPage,
    OnBoardingPage,
    SettingsPage,
    AdvUserProfilePage,
    UserOffersPage,
    OfferPage,
    TestPage,
    SplashScreenPage,
    UserTasksPage,
    UserAchievePage,
    UserUsersPage,
    UserNauPage,
    AdvUserOffersPage,
    AdvTabsPage,
    AdvNotificationsPage,
    AdvHomePage,
    HomePage,
    CreateOffer1Page,
    PlaceFeedbackPage,
    PlacePage,
    SettingsPopover,
    CreateOfferPopover
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
    AppModeService,
    Geolocation,
    LocationService
  ]
})
export class AppModule {}

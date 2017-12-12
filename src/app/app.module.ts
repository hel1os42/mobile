import 'rxjs/add/operator/map';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BarChartComponent } from '../components/bar-chart';
import { LineChartComponent } from '../components/line-chart';
import { AdvHomePage } from '../pages/adv-home/adv-home';
import { AdvNotificationsPage } from '../pages/adv-notifications/adv-notifications';
import { AdvRedeemOfferPage } from '../pages/adv-redeem-offer/adv-redeem-offer';
import { AdvTabsPage } from '../pages/adv-tabs/adv-tabs';
import { AdvUserOffersPage } from '../pages/adv-user-offers/adv-user-offers';
import { CreateOfferInformationPopover } from '../pages/adv-user-offers/information.popover';
import { AdvUserProfilePage } from '../pages/adv-user-profile/adv-user-profile';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { CreateAdvUserProfilePage } from '../pages/create-advUser-profile/create-advUser-profile';
import { CreateAdvUserProfileCategoryPopover } from '../pages/create-advUser-profile/create-advUser-profile.category.popover';
import { CreateAdvUserProfileChildCategoryPopover } from '../pages/create-advUser-profile/create-advUser-profile.childCategory.popover';
import { CreateOffer1Page } from '../pages/create-offer-1/create-offer-1';
import { CreateOffer2Page } from '../pages/create-offer-2/create-offer-2';
import { CreateOffer3Page } from '../pages/create-offer-3/create-offer-3';
import { CreateOffer4Page } from '../pages/create-offer-4/create-offer-4';
import { CreateOffer5Page } from '../pages/create-offer-5/create-offer-5';
import { CreateOfferPage } from '../pages/create-offer/create-offer';
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { FeedPage } from '../pages/feed/feed';
import { SignUpInvitePage } from '../pages/invite/invite';
import { LoginPage } from '../pages/login/login';
import { NotificationsPage } from '../pages/notifications/notifications';
import { OfferTermsPage } from '../pages/offer-terms/offer-terms';
import { CongratulationPopover } from '../pages/offer/congratulation.popover';
import { OfferPage } from '../pages/offer/offer';
import { OfferRedeemPopover } from '../pages/offer/offerRedeem.popover';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { PlaceFeedbackPage } from '../pages/place-feedback/place-feedback';
import { PlacePage } from '../pages/place/place';
import { PlacesPage } from '../pages/places/places';
import { PlacesPopover } from '../pages/places/places.popover';
import { SettingsChangePhonePage } from '../pages/settings-change-phone/settings-change-phone';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsPopover } from '../pages/settings/settings.popover';
import { SignUpCodePage } from '../pages/signup-code/signup-code';
import { SignUpPage } from '../pages/signup/signup';
import { SplashInfoPage } from '../pages/splash-info/splash-info';
import { SplashNewsPage } from '../pages/splash-news/splash-news';
import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { StartPage } from '../pages/start/start';
import { StatisticPage } from '../pages/statistic/statistic';
import { Statistic1Page } from '../pages/statistic1/statistic1';
import { TabsPage } from '../pages/tabs/tabs';
import { TestPage } from '../pages/test/test';
import { TransferPage } from '../pages/transfer/transfer';
import { UserAchievePage } from '../pages/user-achieve/user-achieve';
import { UserNauPage } from '../pages/user-nau/user-nau';
import { UserOffersPage } from '../pages/user-offers/user-offers';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { UserTasksPage } from '../pages/user-tasks/user-tasks';
import { UserUsersPage } from '../pages/user-users/user-users';
import { ApiService } from '../providers/api.service';
import { AppModeService } from '../providers/appMode.service';
import { AuthService } from '../providers/auth.service';
import { GeocodeService } from '../providers/geocode.service';
import { LocationService } from '../providers/location.service';
import { OfferService } from '../providers/offer.service';
import { PlaceService } from '../providers/place.service';
import { ProfileService } from '../providers/profile.service';
import { StorageService } from '../providers/storage.service';
import { TimezoneService } from '../providers/timezone.service';
import { ToastService } from '../providers/toast.service';
import { TokenService } from '../providers/token.service';
import { MyApp } from './app.component';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
      CreateOffer1Page,
      PlaceFeedbackPage,
      PlacePage,
      SplashInfoPage,
      SplashNewsPage,
      SettingsPopover,
      OfferRedeemPopover,
      PlacesPopover,
      CongratulationPopover,
      CreateAdvUserProfileCategoryPopover,
      CreateAdvUserProfileChildCategoryPopover,
      CreateOfferInformationPopover,
      OfferTermsPage,
      SettingsChangePhonePage,
      AdvRedeemOfferPage,
      CreateOffer2Page,
      CreateOffer3Page,
      CreateOffer4Page,
      CreateOffer5Page,
      FeedPage,
      StatisticPage,
      Statistic1Page,
      TransferPage,
      LineChartComponent,
      BarChartComponent
  ],
  imports: [
      BrowserModule,
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
      QRCodeModule,
      IonicModule.forRoot(MyApp, {
        mode: "ios",
        backButtonText: "",
        scrollPadding: false,
        scrollAssist: true,
        autoFocusAssist: false
      }),
      LeafletModule.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [Http] },
      })
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
      CreateOffer1Page,
      PlaceFeedbackPage,
      PlacePage,
      SplashInfoPage,
      SplashNewsPage,
      SettingsPopover,
      OfferRedeemPopover,
      PlacesPopover,
      CongratulationPopover,
      CreateAdvUserProfileCategoryPopover,
      CreateAdvUserProfileChildCategoryPopover,
      CreateOfferInformationPopover,
      OfferTermsPage,
      SettingsChangePhonePage,
      AdvRedeemOfferPage,
      CreateOffer2Page,
      CreateOffer3Page,
      CreateOffer4Page,
      CreateOffer5Page,
      FeedPage,
      StatisticPage,
      Statistic1Page,
      TransferPage,
      LineChartComponent,
      BarChartComponent
  ],
  providers: [
      StatusBar,
      SplashScreen,
      ImagePicker,
      FileTransfer,
      { provide: ErrorHandler, useClass: IonicErrorHandler },
      BarcodeScanner,
      ApiService,
      AuthService,
      StorageService,
      TokenService,
      ToastService,
      ProfileService,
      OfferService,
      AppModeService,
      Geolocation,
      LocationService,
      PlaceService,
      TimezoneService,
      GeocodeService
  ]
})
export class AppModule { }

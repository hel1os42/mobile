import 'rxjs/add/operator/map';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppAvailability } from '@ionic-native/app-availability';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BarChartComponent } from '../components/bar-chart';
import { LineChartComponent } from '../components/line-chart';
import { AdvNotificationsPage } from '../pages/adv-notifications/adv-notifications';
import { AdvRedeemOfferPage } from '../pages/adv-redeem-offer/adv-redeem-offer';
import { AdvTabsPage } from '../pages/adv-tabs/adv-tabs';
import { AdvUserOffersPage } from '../pages/adv-user-offers/adv-user-offers';
import { CreateOfferInformationPopover } from '../pages/adv-user-offers/information.popover';
import { AdvUserProfilePage } from '../pages/adv-user-profile/adv-user-profile';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { CreateAdvUserProfilePage } from '../pages/create-advUser-profile/create-advUser-profile';
import { CreateAdvUserProfileCategoryPopover } from '../pages/create-advUser-profile/create-advUser-profile.category.popover';
import { CreateAdvUserProfileTagsPopover } from '../pages/create-advUser-profile/create-advUser-profile.tags.popover';
import { CreateAdvUserProfileFeaturesPopover } from '../pages/create-advUser-profile/create-advUser-profile.features.popover';
import { CreateAdvUserProfileTypesPopover } from '../pages/create-advUser-profile/create-advUser-profile.types.popover';
import { CreateOffer1Page } from '../pages/create-offer-1/create-offer-1';
import { CreateOffer2Page } from '../pages/create-offer-2/create-offer-2';
import { CreateOffer3Page } from '../pages/create-offer-3/create-offer-3';
import { CreateOffer4Page } from '../pages/create-offer-4/create-offer-4';
import { CreateOffer5Page } from '../pages/create-offer-5/create-offer-5';
import { CreateOfferPage } from '../pages/create-offer/create-offer';
import { CreateUserProfilePage } from '../pages/create-user-profile/create-user-profile';
import { FeedPage } from '../pages/feed/feed';
import { LoginPage } from '../pages/login/login';
import { InvitePage } from '../pages/invite/invite';
import { NotificationsPage } from '../pages/notifications/notifications';
import { OfferTermsPage } from '../pages/offer-terms/offer-terms';
import { CongratulationPopover } from '../pages/offer/congratulation.popover';
import { OfferPage } from '../pages/offer/offer';
import { OfferRedeemPopover } from '../pages/offer/offerRedeem.popover';
import { OnBoardingPage } from '../pages/onboarding/onboarding';
import { PlacePage } from '../pages/place/place';
import { PlacesPage } from '../pages/places/places';
import { FilterPopover } from '../pages/places/filter.popover';
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
import { TemporaryPage } from '../pages/temporary/temporary';
import { TransferPopover } from '../pages/user-nau/transfer.popover';
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
import { TransactionService } from '../providers/transaction.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ImageCropperModule } from 'ng2-img-cropper';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { NetworkService } from '../providers/network.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ShareService } from '../providers/share.service';
import { FavoritesService } from '../providers/favorites.service';
import { FormatTimePipe } from '../pipes/format-time.pipe';
import { TestimonialsService } from '../providers/testimonials.service';
import { NoPlacesPopover } from '../pages/places/noPlaces.popover';
import { LinkPopover } from '../pages/offer/link.popover';
import { OneSignal } from '@ionic-native/onesignal';
import { TimeframesPopover } from '../pages/offer/timeframes.popover';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { SocialService } from '../providers/social.service';
import { File } from '@ionic-native/file';
import { Facebook } from '@ionic-native/facebook';
import { NoticePopover } from '../pages/offer/notice.popover';
import { FlurryAnalytics } from '@ionic-native/flurry-analytics';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { PushTokenService } from '../providers/pushToken.service';
import { ComplaintPopover } from '../pages/place/complaint.popover';
import { AnalyticsService } from '../providers/analytics.service';
import { ReportService } from '../providers/report.service';
import { TestimonialPopover } from '../pages/place/testimonial.popover';
import { LimitationPopover } from '../pages/place/limitation.popover';
import { AdjustService } from '../providers/adjust.service';
import { Pro } from '@ionic/pro';
import { Injectable, Injector } from '@angular/core';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const IONIC_APP_ID = '590f0eb2';
const VERSION = '1.5.9';

Pro.init(IONIC_APP_ID, {
    appVersion: VERSION
})

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    ionicErrorHandler: IonicErrorHandler;
    userId = '';
    userPhone = '';

    constructor(
        injector: Injector,
        private appMode: AppModeService,
        private profile: ProfileService) {

        try {
            this.ionicErrorHandler = injector.get(IonicErrorHandler);
        } catch (e) {
            // Unable to get the IonicErrorHandler provider, ensure
            // IonicErrorHandler has been added to the providers list below
        }
    }

    handleError(err: any) {
        // err.envName = this.appMode.getEnvironmentMode();
        if (!this.userId) {
            this.profile.get(false, false)
                .subscribe(user => {
                    this.userId = user.id;
                    this.userPhone = user.phone || '';
                    err.userId = this.userId;
                    err.userPhone = this.userPhone;
                },
                    error => err.userId = '');
        };
        if (err.message) {
            err.message = err.message + '\nuserId: ' + this.userId;
            err.message = this.userPhone 
            ? err.message + '\nuserPhone: ' + this.userPhone 
            : err.message;
        } else {
            err.userId = this.userId;
            err.userPhone = this.userPhone;
        }
        if (!err.url) {
            err.message = err.message || '';
            err.message = err.message + '\nenvName: ' + this.appMode.getEnvironmentMode();
        }
        Pro.monitoring.handleNewError(err);
        // Remove this if you want to disable Ionic's auto exception handling
        // in development mode.
        this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
    }
}


@NgModule({
    declarations: [
        MyApp,
        StartPage,
        SignUpPage,
        SignUpCodePage,
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
        SplashScreenPage,
        UserTasksPage,
        UserAchievePage,
        UserUsersPage,
        UserNauPage,
        AdvUserOffersPage,
        AdvTabsPage,
        AdvNotificationsPage,
        CreateOffer1Page,
        InvitePage,
        PlacePage,
        SplashInfoPage,
        SplashNewsPage,
        TemporaryPage,
        SettingsPopover,
        OfferRedeemPopover,
        FilterPopover,
        TransferPopover,
        CongratulationPopover,
        CreateAdvUserProfileCategoryPopover,
        CreateAdvUserProfileTagsPopover,
        CreateAdvUserProfileTypesPopover,
        CreateAdvUserProfileFeaturesPopover,
        CreateOfferInformationPopover,
        NoPlacesPopover,
        LinkPopover,
        TimeframesPopover,
        NoticePopover,
        TestimonialPopover,
        ComplaintPopover,
        LimitationPopover,
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
        LineChartComponent,
        BarChartComponent,
        FormatTimePipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        QRCodeModule,
        IonicModule.forRoot(MyApp, {
            mode: "ios",
            backButtonText: "",
            scrollPadding: false
            //scrollAssist: true,
            //autoFocusAssist: false
        }),
        LeafletModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
        }),
        ImageCropperModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        StartPage,
        SignUpPage,
        SignUpCodePage,
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
        SplashScreenPage,
        UserTasksPage,
        UserAchievePage,
        UserUsersPage,
        UserNauPage,
        AdvUserOffersPage,
        AdvTabsPage,
        AdvNotificationsPage,
        CreateOffer1Page,
        InvitePage,
        PlacePage,
        SplashInfoPage,
        SplashNewsPage,
        TemporaryPage,
        SettingsPopover,
        OfferRedeemPopover,
        FilterPopover,
        TransferPopover,
        CongratulationPopover,
        CreateAdvUserProfileCategoryPopover,
        CreateAdvUserProfileTagsPopover,
        CreateAdvUserProfileTypesPopover,
        CreateAdvUserProfileFeaturesPopover,
        CreateOfferInformationPopover,
        NoPlacesPopover,
        LinkPopover,
        TimeframesPopover,
        NoticePopover,
        TestimonialPopover,
        ComplaintPopover,
        LimitationPopover,
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
        LineChartComponent,
        BarChartComponent
    ],
    providers: [
        Keyboard,
        StatusBar,
        SplashScreen,
        ImagePicker,
        FileTransfer,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        IonicErrorHandler,
        [{ provide: ErrorHandler, useClass: AppErrorHandler }],
        BarcodeScanner,
        ApiService,
        AuthService,
        StorageService,
        TokenService,
        ToastService,
        ProfileService,
        TransactionService,
        OfferService,
        AppModeService,
        Geolocation,
        LocationService,
        PlaceService,
        TimezoneService,
        GeocodeService,
        NetworkService,
        ShareService,
        FavoritesService,
        TestimonialsService,
        SocialService,
        PushTokenService,
        ReportService,
        AnalyticsService,
        Clipboard,
        InAppBrowser,
        AndroidPermissions,
        Diagnostic,
        Network,
        GoogleAnalytics,
        OneSignal,
        TwitterConnect,
        File,
        Facebook,
        FlurryAnalytics,
        AdjustService,
        LaunchNavigator,
        AppAvailability,
    ]
})
export class AppModule { }

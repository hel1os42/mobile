import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from "../pages/tabs/tabs";
import { AuthService } from "../providers/auth.service";
import { OnBoardingPage } from "../pages/onboarding/onboarding";
import { CreateAdvUserProfilePage } from "../pages/create-advUser-profile/create-advUser-profile";
import { CreateOfferPage } from "../pages/create-offer/create-offer";
import { SettingsPage } from "../pages/settings/settings";
import { AdvUserProfilePage } from "../pages/adv-user-profile/adv-user-profile";
import { UserTasksPage } from "../pages/user-tasks/user-tasks";
import { AdvUserOffersPage } from "../pages/adv-user-offers/adv-user-offers";
import { UserUsersPage } from "../pages/user-users/user-users";
import { UserNauPage } from "../pages/user-nau/user-nau";
import { LoginPage } from "../pages/login/login";
import { AdvTabsPage } from "../pages/adv-tabs/adv-tabs";
import { NotificationsPage } from "../pages/notifications/notifications";
import { PlacePage } from "../pages/place/place";
import { PlacesPage } from "../pages/places/places";
import { PlaceFeedbackPage } from "../pages/place-feedback/place-feedback";
import { SplashNewsPage } from "../pages/splash-news/splash-news";
import { BookmarksPage } from "../pages/bookmarks/bookmarks";
import { UserAchievePage } from "../pages/user-achieve/user-achieve";
import { OfferTermsPage } from "../pages/offer-terms/offer-terms";
import { AdvRedeemOfferPage } from '../pages/adv-redeem-offer/adv-redeem-offer';
import { AdvNotificationsPage } from "../pages/adv-notifications/adv-notifications";
import { FeedPage } from "../pages/feed/feed";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
        private auth: AuthService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.rootPage = !this.auth.isLoggedIn() ? OnBoardingPage : TabsPage;

            //this.rootPage = CreateOfferPage;
        })

        this.auth.onLogout.subscribe(() => this.rootPage = LoginPage);
    }
}

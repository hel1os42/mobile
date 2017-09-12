import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StartPage } from '../pages/start/start';
import { TabsPage } from "../pages/tabs/tabs";
import { AuthService } from "../providers/auth.service";
import { OnBoardingPage } from "../pages/onboarding/onboarding";
import { CreateUserProfilePage } from "../pages/create-user-profile/create-user-profile";
import { CreateAdvUserProfilePage } from "../pages/create-advUser-profile/create-advUser-profile";
import { CreateOfferPage } from "../pages/create-offer/create-offer";
import { SettingsPage } from "../pages/settings/settings";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { AdvUserProfilePage } from "../pages/adv-user-profile/adv-user-profile";
import { UserOffersPage } from "../pages/user-offers/user-offers";
import { OfferPage } from "../pages/offer/offer";
import { SplashScreenPage } from "../pages/splash-screen/splash-screen";
import { UserRewardsPage } from "../pages/user-rewards/user-rewards";
import { AdvUserOffersPage } from "../pages/adv-user-offers/adv-user-offers";
import { UserUsersPage } from "../pages/user-users/user-users";
import { UserNauPage } from "../pages/user-nau/user-nau";
import { TokenService } from "../providers/token.service";
import { LoginPage } from "../pages/login/login";
import { AdvTabsPage } from "../pages/adv-tabs/adv-tabs";
import { NotificationsPage } from "../pages/notifications/notifications";
import { ProfileService } from '../providers/profile.service';
import { SignUpPage } from "../pages/signup/signup";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
        //private nav: NavController,
        private auth: AuthService,
        private token: TokenService,
        private profile: ProfileService) {

        platform.ready().then((resp) => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.rootPage = !this.auth.isLoggedIn()
                ? StartPage : this.profile.getMode() ? AdvTabsPage : TabsPage;

            //this.rootPage = SettingsPage;
        });
    }
}

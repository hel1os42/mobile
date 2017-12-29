import { ProfileService } from '../../providers/profile.service';
import { UserNauPage } from '../user-nau/user-nau';
import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { AppModeService } from '../../providers/appMode.service';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { FeedPage } from '../feed/feed';
import { NotificationsPage } from '../notifications/notifications';
import { PlacesPage } from '../places/places';
import { UserProfilePage } from '../user-profile/user-profile';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    isDevMode = false;

    private _onHomeChangeSubscription: Subscription;

    tab1Root;
    // tab2Root = UserProfilePage;temporary
    tab2Root = UserNauPage;
    tab3Root = BookmarksPage;
    tab4Root = NotificationsPage;
    tab5Root = FeedPage;
    selectedTabIndex = 0;
    nauParams;//temporary

    @ViewChild('tabs') tabs: Tabs;

    constructor(private appMode: AppModeService,
                private navParams: NavParams,
                private profile: ProfileService) {
//temporary
            this.profile.getWithAccounts()
                .subscribe(resp => {
                this.nauParams = { NAU: resp.accounts.NAU };
            });
//temporary
        this.isDevMode = this.appMode.getEnvironmentMode() == 'dev';

        // this.tab1Root = this.appMode.getHomeMode()
        //     ? PlacesPage
        //     : SplashScreenPage;to do

        // this._onHomeChangeSubscription = this.appMode.onHomeChange.subscribe(showPlaces => {
        //     this.tabs.getByIndex(0)
        //         .setRoot(showPlaces ? PlacesPage : SplashScreenPage);
        // });

        // temporary - always show PlacesPage
        this.tab1Root = PlacesPage;

        this._onHomeChangeSubscription = this.appMode.onHomeChange.subscribe(showPlaces => {
            // this.tabs.getByIndex(0)
            //    .setRoot(PlacesPage);
        });

        this.selectedTabIndex = this.navParams.get('selectedTabIndex') ? this.navParams.get('selectedTabIndex') : 0;
    }

    tabChange() {
        if (this.tabs.getSelected().index > 0)
            this.appMode.setHomeMode(false);
    }

    ionViewWillUnload() {
        this._onHomeChangeSubscription.unsubscribe();
    }
}

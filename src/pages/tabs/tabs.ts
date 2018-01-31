import { Component, ViewChild } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { AppModeService } from '../../providers/appMode.service';
import { ProfileService } from '../../providers/profile.service';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { FeedPage } from '../feed/feed';
import { NotificationsPage } from '../notifications/notifications';
import { PlacesPage } from '../places/places';
import { UserNauPage } from '../user-nau/user-nau';
import { UserProfilePage } from '../user-profile/user-profile';
import { TransactionService } from '../../providers/transaction.service';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    private _onHomeChangeSubscription: Subscription;

    tab1Root;
    // tab2Root = UserProfilePage;return
    tab2Root; //temporary
    tab3Root = BookmarksPage;
    tab4Root = NotificationsPage;
    tab5Root = FeedPage;
    selectedTabIndex = 0;
    nauParams;//temporary
    shownTransactions: boolean;//temporary
    envName: string;

    @ViewChild('tabs') tabs: Tabs;

    constructor(
                private appMode: AppModeService,
                private navParams: NavParams,
                private profile: ProfileService,
                private transaction: TransactionService) {

        //temporary
        this.envName = this.appMode.getEnvironmentMode();
        this.tab2Root = (this.envName === 'dev' || this.envName === 'test') 
        ? UserProfilePage : UserNauPage;

                this.profile.getWithAccounts()
                    .subscribe(resp => {
                        this.nauParams = resp.accounts.NAU;
                    });
        //temporary

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

    //temporary
    refresh() {
        if (this.shownTransactions) {
            this.profile.refreshAccounts();
            this.transaction.refresh();
        }
        this.shownTransactions = true;
    }
    //temporary

    ionViewWillUnload() {
        this._onHomeChangeSubscription.unsubscribe();
    }
}

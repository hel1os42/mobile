import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { NavParams, Platform, Tabs } from 'ionic-angular';
import { AppModeService } from '../../providers/appMode.service';
import { ProfileService } from '../../providers/profile.service';
import { TransactionService } from '../../providers/transaction.service';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { NotificationsPage } from '../notifications/notifications';
import { PlacesPage } from '../places/places';
import { UserProfilePage } from '../user-profile/user-profile';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root;
    tab2Root = UserProfilePage;
    tab3Root = BookmarksPage;
    tab4Root = NotificationsPage;
    // tab5Root = FeedPage;//temporary - to revert
    selectedTabIndex = 0;
    nauParams;//temporary
    shownTransactions: boolean;//temporary
    envName: string;

    @ViewChild('tabs') tabs: Tabs;

    constructor(
        private platform: Platform,
        private appMode: AppModeService,
        private navParams: NavParams,
        private profile: ProfileService,
        private transaction: TransactionService,
        private statusBar: StatusBar) {

        // this.envName = this.appMode.getEnvironmentMode();
        // this.profile.getWithAccounts(false)
        //     .subscribe(resp => {
        //         this.nauParams = resp.accounts.NAU;
        //     });
        this.tab1Root = PlacesPage;
        this.selectedTabIndex = 0;
    }

    refreshStatusBar(event) {
        let root = event.root;
        let views = event.getViews();
        let length = views.length;
        if (root === PlacesPage || (root === BookmarksPage && length > 1)) {
            this.statusBar.styleLightContent();
        }
        else {
            this.statusBar.styleDefault();
        }
    }
    // refresh() {
    //     if (this.shownTransactions) {
    //         this.profile.refreshAccounts();
    //         this.transaction.refresh();
    //     }
    //     this.shownTransactions = true;
    // }
}

import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { AdjustService } from '../../providers/adjust.service';
import { AppModeService } from '../../providers/appMode.service';
import { ProfileService } from '../../providers/profile.service';
import { TransactionService } from '../../providers/transaction.service';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { InvitePage } from '../invite/invite';
import { PlacesPage } from '../places/places';
import { UserProfilePage } from '../user-profile/user-profile';
import { Tab, ViewController } from 'ionic-angular/umd';
import { OfferPage } from '../offer/offer';

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = PlacesPage;
    tab2Root = InvitePage;
    // tab3Root = NotificationsPage;
    tab3Root = BookmarksPage;
    tab4Root = UserProfilePage;

    selectedTabIndex = 0;
    nauParams;//temporary
    shownTransactions: boolean;//temporary
    envName: string;

    constructor(
        private profile: ProfileService,
        private transaction: TransactionService,
        private statusBar: StatusBar,
        private appMode: AppModeService,
        private adjust: AdjustService) {

        this.envName = this.appMode.getEnvironmentMode();
        // this.profile.getWithAccounts(false)
        //     .subscribe(resp => {
        //         this.nauParams = resp.accounts.NAU;
        //     });
        // this.tab1Root = PlacesPage;
        this.selectedTabIndex = 0;
    }

    setAdjustEvent() {
        this.adjust.setEvent('INVITE_FRIENDS_PAGE_VISIT');
    }

    refreshStatusBar(event: Tab) {

        let root = event.root;
        let views: ViewController[] = event.getViews();
        let length = views.length;
        let page = views[length - 1].component;
        if (root === PlacesPage
            || (root === BookmarksPage && length > 1)
            || (root === UserProfilePage && (page === PlacesPage || page === OfferPage))) {
            this.statusBar.styleLightContent();
        }
        else {
            this.statusBar.styleDefault();
        }
    }

    refresh() {
        if (this.shownTransactions) {
            this.profile.refreshAccounts(false);
            this.transaction.refresh();
        }
        this.shownTransactions = true;
    }
}

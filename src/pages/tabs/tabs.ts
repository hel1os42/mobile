import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { UserProfilePage } from '../user-profile/user-profile';
import { NotificationsPage } from '../notifications/notifications';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { AppModeService } from '../../providers/appMode.service';
import { PlacesPage } from '../places/places';
import { SplashScreenPage } from '../splash-screen/splash-screen';
import { Subscription } from 'rxjs';


@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    private _onHomeChangeSubscription: Subscription;

    tab1Root;
    tab2Root = UserProfilePage;
    tab3Root = BookmarksPage;
    tab4Root = NotificationsPage;

    @ViewChild('tabs') tabs: Tabs;

    constructor(private nav: NavController,
        private appMode: AppModeService) {

        // this.tab1Root = this.appMode.getHomeMode()
        //     ? PlacesPage
        //     : SplashScreenPage;to do
        this.tab1Root = PlacesPage;//remove

        // this._onHomeChangeSubscription = this.appMode.onHomeChange.subscribe(showPlaces => {
        //     this.tabs.getByIndex(0)
        //         .setRoot(showPlaces ? PlacesPage : SplashScreenPage);
        // });
    }

    tabChange() {
        if (this.tabs.getSelected().index > 0)
            this.appMode.setHomeMode(false);
    }

    ionViewWillUnload() {
        this._onHomeChangeSubscription.unsubscribe();
    }
}

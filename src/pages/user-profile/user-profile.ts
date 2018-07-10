import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, NavController, Slides } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { Account } from '../../models/account';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { TransactionService } from '../../providers/transaction.service';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { SettingsPage } from '../settings/settings';
import { UserAchievePage } from '../user-achieve/user-achieve';
import { UserNauPage } from '../user-nau/user-nau';
import { UserOffersPage } from '../user-offers/user-offers';
import { UserTasksPage } from '../user-tasks/user-tasks';
import { UserUsersPage } from '../user-users/user-users';
import { AdjustService } from '../../providers/adjust.service';
import { MockOffers } from '../../mocks/mockOffers';
import { Offer } from '../../models/offer';

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {
    user: User = new User();
    balance: number;
    onRefreshAccounts: Subscription;
    NAU: Account;
    branchDomain = 'https://nau.app.link';
    offers = [];

    @ViewChild(Slides) slides: Slides;

    constructor(
        private profile: ProfileService,
        private nav: NavController,
        private auth: AuthService,
        public alert: AlertController,
        private transaction: TransactionService,
        private translate: TranslateService,
        private adjust: AdjustService) {

        this.offers = MockOffers.items;
        
        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.user = resp;
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
                this.user.picture_url = this.user.picture_url + '?' + new Date().valueOf();
            })
        if (!this.balance) {
            this.profile.getWithAccounts()
                .subscribe(resp => {
                    this.user = resp;
                    this.NAU = resp.accounts.NAU;
                    this.balance = this.NAU ? this.NAU.balance : 0;
                });
        }
    }

    ionSelected() {
        this.profile.refreshAccounts(false);
        this.transaction.refresh();
    }

    openSettings() {
        this.nav.push(SettingsPage, { isAdvMode: false, user: this.user });
    }

    openRewards(user: User) {
        this.nav.push(UserTasksPage, { user: this.user });
    }

    openAchieve(user: User) {
        this.nav.push(UserAchievePage, { user: this.user });
    }

    openUserOffers() {
        this.nav.push(UserOffersPage);
    }

    openUserNau() {
        // if (!this.platform.is('ios')) {
        this.nav.push(UserNauPage, { NAU: this.NAU });
        // }
    }

    openUserUsers() {
        this.nav.push(UserUsersPage);
    }

    openCreateUserProfilePage() {
        this.nav.push(CreateUserProfilePage, { user: this.user });
    }

    logout() {
        this.translate.get(['CONFIRM', 'UNIT'])
            .subscribe(resp => {
                let content = resp['CONFIRM'];
                let unit = resp['UNIT'];
                let confirm = this.alert.create({
                    title: content['LOGOUT'],
                    message: content['ARE_YOU_SHURE'],
                    buttons: [
                        {
                            text: unit['CANCEL'],
                            handler: () => {
                            }
                        },
                        {
                            text: unit['OK'],
                            handler: () => {
                                this.auth.logout();
                            }
                        }
                    ]
                });
                confirm.present();
            })
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }

    slideChanged(event) {
        
    }

    openPlace(event, place, isShare?: boolean, offer?: Offer) {

    }
    getStars(star: number) {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(star > i);
        }
        return showStars;
    }

    getDistance() {
        return 2000;
    }

    shareInvite() {
        if (this.user && this.user.invite_code) {
            const Branch = window['Branch'];
            let properties = {
                canonicalIdentifier: `?invite_code=${this.user.invite_code}`,
                canonicalUrl: `${this.branchDomain}?invite_code=${this.user.invite_code}`,
                title: this.user.name,
                contentImageUrl: this.user.picture_url,
                // contentDescription: '',
                // price: 12.12,
                // currency: 'GBD',
                contentIndexingMode: 'private',
                contentMetadata: {
                    invite_code: this.user.invite_code,
                }
            };
            var branchUniversalObj = null;
            Branch.createBranchUniversalObject(properties)
                .then(res => {
                    branchUniversalObj = res;
                    let analytics = {};
                    let message = 'NAU';
                    branchUniversalObj.showShareSheet(analytics, properties, message);

                    branchUniversalObj.onLinkShareResponse(res => {
                        this.adjust.setEvent('IN_FR_BUTTON_CLICK_PROFILE_PAGE');
                    });
                    // console.log('Branch create obj error: ' + JSON.stringify(err))
                })
        }
        else return;
    }

    ngOnDestroy() {
        this.onRefreshAccounts.unsubscribe();
    }

}

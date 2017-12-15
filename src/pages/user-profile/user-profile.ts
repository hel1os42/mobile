import { Account } from '../../models/account';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { Subscription } from 'rxjs/Rx';
import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { SettingsPage } from '../settings/settings';
import { UserAchievePage } from '../user-achieve/user-achieve';
import { UserNauPage } from '../user-nau/user-nau';
import { UserOffersPage } from '../user-offers/user-offers';
import { UserTasksPage } from '../user-tasks/user-tasks';
import { UserUsersPage } from '../user-users/user-users';
import { AppModeService } from '../../providers/appMode.service';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {
    user: User = new User();
    balance: number;
    onRefreshAccounts: Subscription;
    time = new Date().valueOf();
    NAU: Account;

    @ViewChild(Slides) slides: Slides;

    constructor(
        private profile: ProfileService,
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        public alertCtrl: AlertController) {

        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.user = resp;
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            })

        this.profile.getWithAccounts()
            .subscribe(resp => {
                this.user = resp;
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            });
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
        this.nav.push(UserNauPage, { NAU: this.NAU });
    }

    openUserUsers() {
        this.nav.push(UserUsersPage);
    }

    openCreateUserProfilePage() {
        this.nav.push(CreateUserProfilePage, { user: this.user });
    }

    logout() {
        let confirm = this.alertCtrl.create({
            title: 'Logout',
            message: 'Are you sure?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.auth.logout();
                        this.appMode.removeDevMode();
                    }
                }
            ]
        });
        confirm.present();
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }

    ionViewWillUnload() {
        this.onRefreshAccounts.unsubscribe();
    }

}

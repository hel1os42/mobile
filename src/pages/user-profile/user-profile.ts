import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { SettingsPage } from "../settings/settings";
import { UserTasksPage } from "../user-tasks/user-tasks";
import { UserAchievePage } from "../user-achieve/user-achieve";
import { UserOffersPage } from "../user-offers/user-offers";
import { UserNauPage } from "../user-nau/user-nau";
import { UserUsersPage } from "../user-users/user-users";

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {
    user: User = new User();
    balance: number;
    NAU_Id: string;
    
    @ViewChild(Slides) slides: Slides;

    constructor(
        private profile: ProfileService,
        private auth: AuthService,
        private nav: NavController) {
        
        this.profile.getWithAccounts()
        .subscribe(resp => {
            this.user = resp;
            this.balance = this.user.accounts.NAU.balance;
            this.NAU_Id = this.user.accounts.NAU.id;
        })
        this.profile.set(this.user);
    }

    openSettings() {
        this.nav.push(SettingsPage, {isAdvMode: false, user: this.user});
    }

    openRewards(user: User) {
        this.nav.push(UserTasksPage, {user: this.user});
    }

    openAchieve(user: User) {
        this.nav.push(UserAchievePage, {user: this.user});
    }

    openUserOffers() {
        this.nav.push(UserOffersPage)
    }

    openUserNau() {
        this.nav.push(UserNauPage, { balance: this.balance, NAU_Id: this.NAU_Id })
    }

    openUserUsers() {
        this.nav.push(UserUsersPage)
    }
    
    logout() {
        //this.auth.logout();
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }
}
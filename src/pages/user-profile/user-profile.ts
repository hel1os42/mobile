import { Component, ViewChild } from '@angular/core';
import { App, NavController, Slides } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { SettingsPage } from "../settings/settings";
import { UserRewardsPage } from "../user-rewards/user-rewards";
import { UserAchievePage } from "../user-achieve/user-achieve";

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {
    user: User = new User();
    
    @ViewChild(Slides) slides: Slides;

    constructor(
        private app: App,
        private profile: ProfileService,
        private auth: AuthService,
        private nav: NavController) {

    }

    ionViewDidEnter() {
        this.profile.get()
            .subscribe(user => this.user = user);
    }

    openSettings() {
        //this.app.getRootNav().setRoot(SettingsPage);
        this.nav.push(SettingsPage);
    }

    openRewards() {
        this.nav.push(UserRewardsPage);
    }

    openAchieve() {
        this.nav.push(UserAchievePage);
    }
    
    logout() {
        this.auth.logout();
        this.app.getRootNav().setRoot(StartPage);
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }
}
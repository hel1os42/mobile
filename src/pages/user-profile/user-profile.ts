import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth.service";
import { StartPage } from "../start/start";
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";
import { SettingsPage } from "../settings/settings";

@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html'
})
export class UserProfilePage {
    user: User;    

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
    
    logout() {
        this.auth.logout();
        this.app.getRootNav().setRoot(StartPage);
    }
}
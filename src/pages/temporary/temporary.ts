import { TabsPage } from '../tabs/tabs';
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';
import { ProfileService } from '../../providers/profile.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-temporary',
    templateUrl: 'temporary.html'
})
export class TemporaryPage {
    constructor(
        private profile: ProfileService,
        private nav: NavController) {

    }

    skip() {
        this.profile.get(true, false)
            .subscribe(res => {
                if (res.name == '' && !res.email) {
                    this.nav.setRoot(CreateUserProfilePage);
                }
                else {
                    this.nav.setRoot(TabsPage, { index: 0 });
                }
            });
    }
}
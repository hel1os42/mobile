import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileService } from "../../providers/profile.service";
import { User } from "../../models/user";

@Component({
    selector: 'page-home-user-page',
    templateUrl: 'home-user-page.html'
})
export class HomeUserPage {

    constructor(
        private nav: NavController,
        private profile: ProfileService) {
    }

    ionViewDidEnter() {

    }
}

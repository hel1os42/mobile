import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';

@Component({
    selector: 'page-settings-change-phone',
    templateUrl: 'settings-change-phone.html'
})
export class SettingsChangePhonePage {

    user = new User;
    visibleChangePhone: boolean = true;
    otp: string;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private auth: AuthService,
                private profile: ProfileService) {
                
                this.user = this.navParams.get('user');
    }

    toggleChangePhone() {
        this.visibleChangePhone = false;
        this.otp = this.auth.getOtp(this.user.phone);
    }

    changePhone() {
        this.profile.put(this.user);
        this.nav.pop();
    }
}

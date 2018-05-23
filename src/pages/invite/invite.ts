import { Component } from '@angular/core';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastService } from '../../providers/toast.service';
import { NavController } from 'ionic-angular';
import { UserUsersPage } from '../user-users/user-users';

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})
export class InvitePage {
    user = new User();
    branchDomain = 'https://nau.app.link';
    onRefresh: Subscription;

    constructor(
        private profile: ProfileService,
        private clipboard: Clipboard,
        private toast: ToastService,
        private nav: NavController) {

        this.profile.get(false, false)
            .subscribe(user => this.user = user);

        this.onRefresh = this.profile.onRefresh
            .subscribe(user => this.user = user);
    }

    copyInvCode() {
        this.clipboard.copy(this.user.invite_code);
        this.toast.showNotification('TOAST.COPY_NOTIFICATION');
    }

    shareInvite() {
        const Branch = window['Branch'];
        let properties = {
            canonicalIdentifier: `?invite_code=${this.user.invite_code}`,
            canonicalUrl: `${this.branchDomain}/?invite_code=${this.user.invite_code}`,
            title: this.user.name,
            contentImageUrl: this.user.picture_url + '?size=mobile',
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
                branchUniversalObj.showShareSheet(analytics, properties, message)
                    .then(resp => console.log(resp))
            }).catch(function (err) {
                // console.log('Branch create obj error: ' + JSON.stringify(err))
            })
    }

    openUserUsers() {
        this.nav.push(UserUsersPage);
    }

}
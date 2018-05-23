import { Component } from '@angular/core';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';
import { NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastService } from '../../providers/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'page-user-users',
    templateUrl: 'user-users.html'
})
export class UserUsersPage {
    referrals: User[];
    total: number;
    page = 1;
    lastPage: number;
    segment;
    user = new User();
    branchDomain = 'https://nau.app.link';
    onRefresh: Subscription;

    constructor(
        private profile: ProfileService,
        private navParams: NavParams,
        private clipboard: Clipboard,
        private toast: ToastService) {

        this.segment = 'invite';
        if (this.navParams.get('user')) {
            this.user = this.navParams.get('user');
        }
        else {
            this.profile.get(false, false)
                .subscribe(user => this.user = user);
        }
        this.profile.getReferrals(this.page)
            .subscribe(resp => {
                this.referrals = resp.data;
                this.total = resp.total;
                this.lastPage = resp.last_page;
            });
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
                console.log('Branch create obj error: ' + JSON.stringify(err))
            })
    }

    doInfinite(infiniteScroll) {
        this.page = this.page + 1;
        if (this.page <= this.lastPage) {
            setTimeout(() => {
                this.profile.getReferrals(this.page)
                    .subscribe(resp => {
                        this.referrals = [...this.referrals, ...resp.data];
                        infiniteScroll.complete();
                    });
            });
        }
        else {
            infiniteScroll.complete();
        }
    }

}
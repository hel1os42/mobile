import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { AdjustService } from '../../providers/adjust.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
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
        private nav: NavController,
        private adjust: AdjustService,
        private translate: TranslateService) {

        this.profile.get(false, true)
            .subscribe(user => this.user = user);

        this.onRefresh = this.profile.onRefresh
            .subscribe(user => this.user = user);
    }

    copyReferralLink() {
        let link = `${this.branchDomain}?invite_code=${this.user.invite_code}`;
        this.clipboard.copy(link);
        this.toast.showNotification('TOAST.COPY_NOTIFICATION');
    }

    inviteFriend() {
        if (this.user && this.user.invite_code) {
            this.translate.get('SHARING.INVITE')
                .subscribe(translation => {
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
                            let message = translation;
                            branchUniversalObj.showShareSheet(analytics, properties, message);

                            branchUniversalObj.onLinkShareResponse(res => {
                                this.adjust.setEvent('IN_FR_BUTTON_CLICK_INVITE_PAGE');
                            });
                            // console.log('Branch create obj error: ' + JSON.stringify(err))
                        })
                })
        }
    }

    openUserUsers() {
        this.nav.push(UserUsersPage);
    }

    ngOnDestroy() {
        this.onRefresh.unsubscribe();
    }

}

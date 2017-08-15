import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { CreateUserProfile } from '../../pages/create-user-profile/create-user-profile';

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})

export class InvitePage {
    inviteCode: string;

    constructor(
        private nav: NavController,
        private auth: AuthService) {

    }

    apply() {
        this.auth
            .getReferrerId(this.inviteCode)
            .subscribe(
                data => {
                    this.auth.setRegisterData(data);
                    this.nav.push(CreateUserProfile);
                }
            );
    }
}

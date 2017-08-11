import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { RegisterPage } from '../../pages/register/register';

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
                resp => {
                    this.auth.setRegisterData(resp.json());
                    this.nav.push(RegisterPage);
                }
            );
    }
}

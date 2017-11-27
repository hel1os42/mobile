import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})

export class SignUpInvitePage {
    code = { inviteCode: '59c2af2' };//to do
    //data: Register = new Register();

    constructor(
        private nav: NavController,
        private auth: AuthService) {

    }

    next() {
        this.auth.setInviteCode(this.code.inviteCode);
        this.nav.push(SignUpPage);
    }

}

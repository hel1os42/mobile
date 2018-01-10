import { AppModeService } from '../../providers/appMode.service';
import { StorageService } from '../../providers/storage.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})

export class SignUpInvitePage {
    code = { inviteCode: '' };//to do
    //data: Register = new Register();

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private storage: StorageService) {

        this.code.inviteCode = this.storage.get('invCode') ? this.storage.get('invCode') : '';

    }

    next() {
        this.auth.setInviteCode(this.code.inviteCode);
        this.nav.push(SignUpPage);
    }

    getDevMode() {
        return this.appMode.getEnvironmentMode() === 'dev';
    }

}

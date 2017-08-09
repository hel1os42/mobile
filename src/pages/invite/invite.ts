import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { RegisterPage } from '../../pages/register/register';
import { StorageService } from "../../providers/storage.service";
import { Register } from "../../models/register";

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})

export class InvitePage {
    data: Register = new Register();

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private storage: StorageService) {
        
    }

    apply() {
        this.authService
            .getReferrerId(this.auth.getInviteCode())
            .subscribe(
                resp => {
                    this.data = resp.json();
                    this.nav.push(RegisterPage);
                }
            );
    }
}
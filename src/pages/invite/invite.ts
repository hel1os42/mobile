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
    inviteCode: string;
    key = 'Register'
    data: Register = new Register();

    constructor(
        public nav: NavController,
        private authService: AuthService,
        private storage: StorageService) {
        
    }

    apply() {
        this.authService
            .getReferrerId(this.inviteCode)
            .subscribe(
                resp => {
                    this.data = resp.json();
                    this.storage.set(this.key, this.data)
                    this.nav.push(RegisterPage);
                }
            );
    }
}
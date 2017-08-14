import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AuthService } from "../../providers/auth.service";
import { TabsPage } from "../tabs/tabs";

@Component({
    selector: 'page-create-user-profile',
    templateUrl: 'create-user-profile.html'
})

export class CreateUserProfile {
    data: Register = new Register();

    constructor(
        private nav: NavController,
        private auth: AuthService) {
    }

    ionViewDidEnter() {
        let inviteCode = this.auth.getInviteCode();
        this.data = this.auth.getRegisterData();
        if (this.data.referrer_id)
            return;
        else
            this.auth
                .getReferrerId(inviteCode)
                .subscribe(register => { this.data = register; });
    }

    register() {
        this.auth
            .register(this.data)
            .subscribe(resp => {
                this.auth
                    .login({
                        email: this.data.email,
                        password: this.data.password
                    })
                    .subscribe(resp => {
                        this.nav.setRoot(TabsPage);
                    })
                }
            );
    }
}

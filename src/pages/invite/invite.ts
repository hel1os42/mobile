import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { CreateUserProfilePage } from '../../pages/create-user-profile/create-user-profile';
import { OnBoardingPage } from "../onboarding/onboarding";
import { Register } from "../../models/register";

@Component({
    selector: 'page-invite',
    templateUrl: 'invite.html'
})

export class SignUpInvitePage {
    inviteCode: string = "59713";
    data: Register = new Register();

    constructor(
        private nav: NavController,
        private auth: AuthService) {

    }

    apply() {

        this.auth
            .getReferrerId(this.inviteCode)
            .subscribe(
            data => {
                this.data = data;
                //this.auth.setRegisterData(data);
                //this.nav.push(CreateUserProfilePage);
            });
    }

    register() {
        this.data.name = this.data.email;
        this.auth
            .register(this.data)
            .subscribe(resp => {
                // this.auth
                //     .login({
                //         email: this.data.email,
                //         password: this.data.password
                //     })
                //     .subscribe(resp => {
                //         this.nav.setRoot(OnBoardingPage);
                //     })
                this.auth.setRegisterData(this.data);
                this.nav.setRoot(CreateUserProfilePage);

            }
            );
           
    }


}

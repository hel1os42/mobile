import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
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

    // apply() {

    //     this.auth
    //         .getReferrerId(this.inviteCode)
    //         .subscribe(
    //         data => {
    //             this.data = data;
    //             //this.auth.setRegisterData(data);
    //             //this.nav.push(CreateUserProfilePage);
    //         });
    // }

    // register() {
    //     this.auth
    //         .register(this.data)
    //         .subscribe(resp => {
    //             // this.auth
    //             //     .login({
    //             //         email: this.data.email,
    //             //         password: this.data.password
    //             //     })
    //             //     .subscribe(resp => {
    //             //         this.nav.setRoot(OnBoardingPage);
    //             //     })
    //             this.auth.setRegisterData(this.data);
    //             this.nav.setRoot(CreateUserProfilePage);

    //         }
    //         );
           
    // }


}

import { MaxValueValidator } from '../../app/validators/max-value.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { Login } from '../../models/login';
import { TabsPage } from '../tabs/tabs';
import { AppModeService } from '../../providers/appMode.service';
import { SignUpInvitePage } from '../invite/invite';
import { ProfileService } from "../../providers/profile.service";
import { CreateUserProfilePage } from '../create-user-profile/create-user-profile';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    authData: Login = new Login();
    numCodes = ['+7', '+49', '+63', '+57', '+380'];
    numCode: string = '+380';
    page;
    formData: FormGroup;
    regexStr='^[ 0-9]+$';


    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private profile: ProfileService,
        private builder: FormBuilder) {

            this.formData = this.builder.group({  
                code: ['+380', Validators.required],
                phone: ['',  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(this.regexStr)])],
                otp: ['',  Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])]
            });
    }

    login() {
        this.authData.phone = this.formData.value.phone;
        this.numCode = this.formData.value.code;
        this.auth
            .login({
                phone: this.numCode + this.authData.phone,
                code: this.formData.value.otp
                // code: this.authData.phone.slice(-6)
            })
            .subscribe(
            resp => {
                this.appMode.setHomeMode(true);
                this.profile.get(true)
                    .subscribe(resp => {
                        if (resp.name == '' && !resp.email) {
                            this.nav.setRoot(CreateUserProfilePage)
                        }
                        else {
                            this.nav.setRoot(TabsPage, { index: 0 });
                        }
                    });
            });
    }

    signup() {
        this.nav.push(SignUpInvitePage);
    }

}
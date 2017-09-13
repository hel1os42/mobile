import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { Login } from "../../models/login";
import { TabsPage } from "../tabs/tabs";
import { OnBoardingPage } from "../onboarding/onboarding";
import { ProfileService } from '../../providers/profile.service';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    data: Login = new Login();
    
    constructor(
        private nav: NavController,
        private auth: AuthService,
        private profile: ProfileService) { 
        
    }

    login() {
        this.auth
            .login(this.data)
            .subscribe(
                resp => {             
                    this.nav.setRoot(/*this.profile.isOnboardingShown() ? TabsPage :*/ OnBoardingPage);
                }
            );
    }

    signup() {
        this.nav.push(SignUpPage);
    }
}
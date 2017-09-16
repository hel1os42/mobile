import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { Login } from "../../models/login";
import { TabsPage } from "../tabs/tabs";
import { ProfileService } from '../../providers/profile.service';
import { SignUpPage } from '../signup/signup';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { AppModeService } from '../../providers/appMode.service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    data: Login = new Login();
    
    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService) { 
        
    }

    login() {
        this.auth
            .login(this.data)
            .subscribe(
                resp => {
                    this.appMode.setHomeMode(true);   
                    this.nav.setRoot(this.appMode.getAdvMode() ? AdvTabsPage : TabsPage);
                }
            );
    }

    signup() {
        this.nav.push(SignUpPage);
    }
}
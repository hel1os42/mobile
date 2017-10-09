import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { Login } from '../../models/login';
import { TabsPage } from '../tabs/tabs';
import { ProfileService } from '../../providers/profile.service';
import { SignUpPage } from '../signup/signup';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';
import { AppModeService } from '../../providers/appMode.service';
import { SignUpInvitePage } from '../invite/invite';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    data: Login = new Login();
    numCodes = ['+7', '+49', '+63', '+57', '+380'];
    numCode: string = '+380';
    
    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService) { 
        
    }

    login() {
        this.auth
            .login({
                phone: this.numCode + this.data.phone,
                code: this.data.phone.slice(-6)
            })
            .subscribe(
                resp => {
                    this.appMode.setHomeMode(true);  
                    this.nav.setRoot(TabsPage, {index: 0});
                }
            );
    }

    signup() {
        this.nav.push(SignUpInvitePage);
    }
}
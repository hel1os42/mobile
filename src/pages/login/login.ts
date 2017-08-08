import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { Login } from "../../models/login";
import { TabsPage } from "../tabs/tabs";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    data: Login = new Login();
    
    constructor(
        private nav: NavController,
        private authService: AuthService) { 
        
    }

    login() {
        
        this.authService
            .login(this.data)
            .subscribe(
                resp => {                    
                    this.nav.setRoot(TabsPage);
                }
            );
    }
}
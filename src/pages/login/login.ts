import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { Login } from "../../models/login";
import { TabsPage } from "../tabs/tabs";
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    token: any; 
    data: Login = new Login();
    
    constructor(
        private nav: NavController,
        private authService: AuthService,
        private storage: Storage) { 
        
    }

    login() {
        
        this.authService
            .login(this.data)
            .subscribe(
                resp => {
                    this.token = resp.json();
                    this.storage.set('token', this.token);                    
                    this.nav.setRoot(TabsPage);
                }
            );
    }
}
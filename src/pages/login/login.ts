import { Component } from '@angular/core';
import { NavController, ToastController } from "ionic-angular";
import { AuthService } from "../../providers/auth.service";
import { Login } from "../../models/login";
import { TabsPage } from "../tabs/tabs";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage  {
    data: Login = new Login;
    
    constructor(
        public nav: NavController,
        private authService: AuthService,
        private toast: ToastController) { 

        }

    login() {
        alert('Not yet implemented');        
    }
}
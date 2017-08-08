import { Component } from '@angular/core';
import { ToastController, NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AuthService } from "../../providers/auth.service";
import { TabsPage } from "../tabs/tabs";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    inviteCode: string = '59713'
    data: Register = new Register();    

    constructor(
        public nav: NavController,
        private authService: AuthService,
        private toast: ToastController) {
        
    }

    ionViewDidEnter() {
        this.authService
            .getReferrerId(this.inviteCode)
            .subscribe(
                resp => {
                    this.data = resp.json();
                }
            );
    }

    register() {
       
        this.authService
            .register(this.data)
            .subscribe(
                resp => {
                    this.nav.setRoot(TabsPage);
                }
            );
    }
}
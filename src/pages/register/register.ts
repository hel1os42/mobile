import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AuthService } from "../../providers/auth.service";
import { TabsPage } from "../tabs/tabs";
import { StorageService } from "../../providers/storage.service";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    inviteCode: string = '59713';
    data: Register = new Register();
    
    constructor(
        private nav: NavController,
        private authService: AuthService,
        private storage: StorageService) {
        
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
            .subscribe(resp => {
                this.authService
                    .login({
                        email: this.data.email,
                        password: this.data.password
                    })
                    .subscribe(resp => {
                        this.nav.setRoot(TabsPage);
                    })                    
                }
            );
    }
}
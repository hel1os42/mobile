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

        this.authService
            .getReferrerId(this.inviteCode)
            .subscribe(
                resp => {
                    this.data = resp.json();
                },
                errResp => {
                    debugger;
                }
            );
    }

    register() {
       
        this.authService
            .register(this.data)
            .subscribe(
                resp => {
                    this.nav.setRoot(TabsPage);
                },
                errResp => {
                    let err = errResp.json();
                    let messages = [];

                    for (let key in err) {
                        let el = err[key];
                        for (let i = 0; i < el.length; i++) {
                            let msg = el[i];
                            messages.push(msg);
                        }
                    }

                    let toast = this.toast.create({
                        message: messages.join('\n'),
                        duration: 5000,
                        position: 'bottom',
                        dismissOnPageChange: true,
                        cssClass: 'toast'
                    });
                    toast.present();
                }
            );
    }
}
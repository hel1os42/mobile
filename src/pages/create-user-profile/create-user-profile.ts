import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { Register } from "../../models/register";
import { AuthService } from "../../providers/auth.service";
import { TabsPage } from "../tabs/tabs";
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";

@Component({
    selector: 'page-create-user-profile',
    templateUrl: 'create-user-profile.html'
})

export class CreateUserProfilePage {
    data: Register = new Register();
    coords: Coords = new Coords();
    message: string;
    isSelectVisible: boolean = false;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private location: LocationService) {
    }

    ionViewDidEnter() {
        this.data = this.auth.getRegisterData();
        if (this.data.referrer_id)
            return;
        else {
            let inviteCode = this.auth.getInviteCode();
            this.auth
                .getReferrerId(inviteCode)
                .subscribe(register => this.data = register);
        } 
        
        this.location.get()
        .then((resp) => {                
            this.coords = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
            };
        })
        .catch((error) => {
            this.message = error.message;
            console.log(this.message);
        });
    }

    register() {
        this.auth
            .register(this.data)
            .subscribe(resp => {
                this.auth
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

    toggleSelect() {
        this.isSelectVisible = !this.isSelectVisible;
    }
}

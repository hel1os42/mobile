import { Component } from '@angular/core';
import { Register } from "../../models/register";
import { AuthService } from "../../providers/auth.service";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    inviteCode: string = '59713'
    data: Register = new Register();    

    constructor(private authService: AuthService) {
        this.authService
            .getReferrerId(this.inviteCode)
            .subscribe(res => {
                this.data = res.json().data;
            });
    }

    register() {
        this.authService
            .register(this.data)
            .subscribe(res => {
                console.log('User has been successfully registered', res.json());
            });
    }
}
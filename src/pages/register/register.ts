import { Component } from '@angular/core';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    name: string;
    email: string;
    password: string;
    password_confirm: string;

    constructor() {

    }

    register() {
        
    }
}
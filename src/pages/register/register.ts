import { Component } from '@angular/core';
import { Register } from "../../models/register";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    data: Register = new Register();

    constructor() {

    }

    register() {
        
    }
}
import { Injectable } from '@angular/core';
import { Register } from "../models/register";
import { Login } from "../models/login";
import { ApiService } from "./api.service";
import { TokenService } from "./token.service";
import { Token } from "../models/token";

@Injectable()
export class AuthService {
    inviteCode: string = '';
    registerForm: Register = new Register();
    
    constructor(
        private api: ApiService,
        private token: TokenService) {

    }
         
    getInviteCode() {
        return this.inviteCode;            
    }

    isLoggedIn() {
        let token = this.token.get();
        return !!token;
    }

    getReferrerId(inviteCode: string) {
        return this.api.get(`auth/register/${inviteCode}`);
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        let obs = this.api.post('auth/login', login);
        obs.subscribe(resp => {
            let token = resp.json();
            this.token.set(token);
        });
        return obs;
    }

    logout() {
        this.token.remove();
    }

}
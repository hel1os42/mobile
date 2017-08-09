import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Register } from "../models/register";
import { Login } from "../models/login";
import { ApiService } from "./api.service";
import { StorageService } from "./storage.service";
import { Token } from "../models/token";
import 'rxjs/add/operator/share';

@Injectable()
export class AuthService {
    TOKEN_KEY = 'token';
    token: Token;
    inviteCode: string = '';
    INVITE = 'invite';
    
    constructor(
        private api: ApiService,
        private storage: StorageService) {

    }
         
    getInviteCode() {

        if(this.inviteCode === '') {
            this.inviteCode = this.storage.get(this.INVITE);
            return this.inviteCode;
        }
            
    }

    private getToken() {
        if (this.token && this.token.token)
            return this.token;
        this.token = this.storage.get(this.TOKEN_KEY);
        return this.token;
    }

    isLoggedIn() {
        let token = this.getToken();
        return !!token;
    }

    getReferrerId(inviteCode: string) {
        return this.api.get(`auth/register/${inviteCode}`);
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        let sharableObs = this.api.post('auth/login', login).share();
        sharableObs.subscribe(resp => {
            let token = resp.json();
            this.storage.set(this.TOKEN_KEY, token);
        });        
        return sharableObs;
    }

    logout() {
        this.storage.remove(this.TOKEN_KEY);
        this.token = undefined;
    }
}
import { Injectable } from '@angular/core';
import { Register } from "../models/register";
import { Login } from "../models/login";
import { ApiService } from "./api.service";
import { TokenService } from "./token.service";
import { Token } from "../models/token";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {
    inviteCode: string = '59713';
    registerData: Register = new Register();
    
    constructor(
        private api: ApiService,
        private token: TokenService) {

    }
    
    getInviteCode() {
        return this.inviteCode;            
    }

    checkPhone(phone: string) {
        return Observable.create(observer => {
            debugger;
            observer.onNext({ success: true });
            observer.onCompleted();
        });

        //return this.api.post('auth/phone', phone);
    }

    applyCode(messageCode: string){
        let obs = this.api.post('auth/code', messageCode);
        obs.subscribe(token => {
            this.token.set(token);
        });
        return obs;
    }

    getRegisterData() {
        return this.registerData;
    }

    setRegisterData(data) {
        return this.registerData = data;
    }

    isLoggedIn() {
        let token = this.token.get();
        return !!token;
    }

    getReferrerId(inviteCode: string) {
        return Observable.create(observer => {
            observer.onNext({ name: '', email: '', referrer_id: '3243242432432442342',  });
            observer.onCompleted();
        })
        //return this.api.get(`auth/register/${inviteCode}`);
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        let obs = this.api.post('auth/login', login);
        obs.subscribe(token => {this.token.set(token); });
        return obs;
    }

    logout() {
        this.token.remove();
    }

}
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Register } from "../models/register";
import { Login } from "../models/login";
import { ApiService } from "./api.service";

@Injectable()
export class AuthService {
    
    constructor(
        private http: Http,
        private api: ApiService) {

    }

    getReferrerId(inviteCode: string) {
        return this.api.get(`auth/register/${inviteCode}` );
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        return this.api.post('auth/login', login)
    }
}
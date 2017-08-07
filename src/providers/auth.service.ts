import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Register } from "../models/register";
import { Login } from "../models/login";

@Injectable()
export class AuthService {
    base: string = 'https://nau.toavalon.com';

    constructor(private http: Http) {

    }

    getReferrerId(inviteCode: string) {
        return this.http.get(`${this.base}/auth/register/` + inviteCode);
    }

    register(register: Register) {
        return this.http.post(`${this.base}/users`, register);
    }

    login(login: Login) {
        return this.http.post(`${this.base}/auth/login`, login)
    }
}
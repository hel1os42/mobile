import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Register } from "../models/register";

@Injectable()
export class AuthService {
    constructor(private http: Http) {

    }

    getReferrerId(inviteCode: string) {
        return this.http.get('https://nau.toavalon.com/auth/register/' + inviteCode);
    }

    register(register: Register) {
        return this.http.post('https://nau.toavalon.com/users', register);
    }

    login() {

    }
}
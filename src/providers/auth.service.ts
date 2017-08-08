import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Register } from "../models/register";
import { Login } from "../models/login";
import { ApiService } from "./api.service";
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthService {
    
    constructor(
        private http: Http,
        private api: ApiService,
        private storage: Storage) {

    }

    getReferrerId(inviteCode: string) {
        return this.api.get(`auth/register/${inviteCode}`);
    }

    register(register: Register) {
        return this.api.post('users', register);
    }

    login(login: Login) {
        var obs = this.api.post('auth/login', login);
        obs.subscribe(resp => {
            let token = resp.json();
            this.storage.set('token', token);
        });
        return obs;
    }
}
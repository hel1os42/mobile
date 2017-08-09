import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";
import { Token } from "../models/token";

@Injectable()
export class TokenService {
    TOKEN_KEY = 'token';
    token: Token;
    
    constructor(
        private storage: StorageService) {
        
    }

    get() {
        if (this.token)
            return this.token;
        this.token = this.storage.get(this.TOKEN_KEY);
        return this.token;
    }

    set(token: Token) {
        this.remove();
        this.storage.set(this.TOKEN_KEY, token);
    }

    remove() {
        this.storage.remove(this.TOKEN_KEY);
        this.token = undefined;
    }
}
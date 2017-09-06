import { Injectable, EventEmitter } from '@angular/core';
import { StorageService } from "./storage.service";
import { Token } from "../models/token";

@Injectable()
export class TokenService {
    TOKEN_KEY = 'token';
    token: Token;
    onRemove = new EventEmitter();
    
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
        this.token = undefined;
        this.storage.set(this.TOKEN_KEY, token);
    }

    remove() {
        this.storage.remove(this.TOKEN_KEY);
        this.token = undefined;
        this.onRemove.emit();
    }
}
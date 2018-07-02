import { Injectable, EventEmitter } from '@angular/core';
import { StorageService } from "./storage.service";
import { Token } from "../models/token";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppModeService } from './appMode.service';

@Injectable()
export class TokenService {
    TOKEN_KEY = 'token';
    TOKEN_START_TIME ='tokenStart';
    token: Token;
    onRemove = new EventEmitter();
    
    constructor(
        private storage: StorageService,
        private analytics: GoogleAnalytics,
        private appMode: AppModeService) {
        
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
        let date = new Date();
        this.storage.set(this.TOKEN_START_TIME, date.valueOf());
        this.appMode.setRegisteredMode();
    }

    remove(event?: string) {
        this.storage.remove(this.TOKEN_KEY);
        this.token = undefined;
        this.analytics.trackEvent("Session", "Logout", event + ' ' + new Date().toISOString());
        this.onRemove.emit();
    }
}
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class AppModeService {
 
    HOME_MODE_KEY = "isHomeMode";
    ADV_MODE_KEY = "isAdvMode";
    

    constructor(private storage: StorageService) { }
    getAdvMode() {
        let advMode: boolean = this.storage.get(this.ADV_MODE_KEY)
        return advMode;
    }

    setAdvMode(advMode) {
        this.storage.set(this.ADV_MODE_KEY, advMode);
    }
}
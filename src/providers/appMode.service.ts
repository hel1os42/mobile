import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class AppModeService {

    HOME_MODE_KEY = "homeMode";
    ADV_MODE_KEY = "isAdvMode";
    ONBOARDING_KEY = "shownOnboarding";

    constructor(private storage: StorageService) { }
    
    getAdvMode() {
        let advMode: boolean = this.storage.get(this.ADV_MODE_KEY)
        return advMode;
    }

    setAdvMode(advMode) {
        this.storage.set(this.ADV_MODE_KEY, advMode);
    }

    getHomeMode() {
        return this.storage.get(this.HOME_MODE_KEY);
    }

    setHomeMode() {
        this.storage.set(this.HOME_MODE_KEY, true);
    }

    getOnboardingVisible() {
        let isSwown: boolean = this.storage.get(this.ONBOARDING_KEY);
        return isSwown;
    }

    setOnboardingVisible() {
        this.storage.set(this.ONBOARDING_KEY, true);
    }
}

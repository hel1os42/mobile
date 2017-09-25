import { Injectable, EventEmitter } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class AppModeService {

    HOME_MODE_KEY = "homeMode";
    ADV_MODE_KEY = "isAdvMode";
    ONBOARDING_KEY = "shownOnboarding";

    onHomeChange = new EventEmitter<boolean>();

    constructor(private storage: StorageService) { }

    getAdvMode() {
        return !!this.storage.get(this.ADV_MODE_KEY)
    }

    setAdvMode(advMode: boolean) {
        this.storage.set(this.ADV_MODE_KEY, advMode);
    }

    getHomeMode() {
        return !!this.storage.get(this.HOME_MODE_KEY);
    }

    setHomeMode(showPlaces: boolean) {
        let oldShowPlaces = this.getHomeMode();
        this.storage.set(this.HOME_MODE_KEY, showPlaces);
        this.onHomeChange.emit(showPlaces);
    }

    getOnboardingVisible() {
        return !!this.storage.get(this.ONBOARDING_KEY);

    }

    setOnboardingVisible() {
        this.storage.set(this.ONBOARDING_KEY, true);
    }
}

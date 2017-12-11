import { Injectable, EventEmitter } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class AppModeService {

    HOME_MODE_KEY = 'homeMode';
    ADV_MODE_KEY = 'isAdvMode';
    ONBOARDING_KEY = 'shownOnboarding';
    DEV_MODE_KEY = 'isDevMOde'

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

    getDevMode() {
        return !!this.storage.get(this.DEV_MODE_KEY);
    }

    setDevMode(isDevMode: boolean) {
        this.storage.set(this.DEV_MODE_KEY, isDevMode);
    }

    removeDevMode() {
        this.storage.remove(this.DEV_MODE_KEY);
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

import { EventEmitter, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class AppModeService {

    HOME_MODE_KEY = 'homeMode';
    ADV_MODE_KEY = 'isAdvMode';
    ONBOARDING_KEY = 'shownOnboarding';
    ENVIRONMENT_KEY = 'envName';
    FORK_MODE_KEY = 'isForkMode';

    onHomeChange = new EventEmitter<boolean>();
    onEnvironmentMode = new EventEmitter<string>();

    constructor(private storage: StorageService) {
    }

    getAdvMode() {
        return !!this.storage.get(this.ADV_MODE_KEY);
    }

    setAdvMode(advMode: boolean) {
        
        this.storage.set(this.ADV_MODE_KEY, advMode);
    }

    getHomeMode() {
        return !!this.storage.get(this.HOME_MODE_KEY);
    }

    getEnvironmentMode(): string {
        return this.storage.get(this.ENVIRONMENT_KEY);
    }

    setEnvironmentMode(environmentName: string) {
        this.storage.remove(this.ENVIRONMENT_KEY);
        this.storage.set(this.ENVIRONMENT_KEY, environmentName);
        this.onEnvironmentMode.emit(environmentName);
    }

    setHomeMode(showPlaces: boolean) {
        // let oldShowPlaces = this.getHomeMode();
        this.storage.set(this.HOME_MODE_KEY, showPlaces);
        this.onHomeChange.emit(showPlaces);
    }

    getOnboardingVisible() {
        return !!this.storage.get(this.ONBOARDING_KEY);

    }

    setOnboardingVisible() {
        this.storage.set(this.ONBOARDING_KEY, true);
    }

    getForkMode() {
        return !!this.storage.get(this.FORK_MODE_KEY);
    }

    setForkMode() {
        this.storage.set(this.FORK_MODE_KEY, true);
    }
}

import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    constructor() { }

    set(key: string, value: any) {
        if (typeof value === 'undefined') {
            localStorage.setItem(key, '');
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    get(key: string): any {
        var valueStr = localStorage.getItem(key);
        return valueStr ? JSON.parse(valueStr) : undefined;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear(key: string) {
        localStorage.clear();
    }
}
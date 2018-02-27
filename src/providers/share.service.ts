import { Injectable } from '@angular/core';
import { Share } from '../models/share';
import { StorageService } from './storage.service';

@Injectable()
export class ShareService {
    SHARE_KEY = 'share';
    share: Share = this.storage.get(this.SHARE_KEY);

    constructor(private storage: StorageService) {
        this.share = this.storage.get(this.SHARE_KEY);
        if (this.share) {
            this.storage.remove(this.SHARE_KEY);
        }
     }

    get() {
        return this.share;
    }

    set(share) {
        this.share = share;
    }

    remove() {
        this.share = undefined;
    }
}
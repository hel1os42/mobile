import { Injectable, EventEmitter } from '@angular/core';
import { Share } from '../models/share';

@Injectable()
export class ShareService {

    share: Share;
    onShare: EventEmitter<Share>;

    constructor() { }

    get() {
        return this.share;
    }

    set(share) {
        this.share = share;
        this.onShare.emit(this.share);
    }

    remove() {
        this.share = undefined;
    }
}
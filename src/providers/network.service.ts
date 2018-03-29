import { EventEmitter, Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable()
export class NetworkService {

    isConnected: boolean;
    onDisconnectSubscription: Subscription;
    onConnectSubscription: Subscription;
    // onDisconnect = new EventEmitter();
    onConnectEmit = new EventEmitter();

    constructor(
        private network: Network,
        private toast: ToastService) {
    }

    getStatus() {
        if (this.network.type === 'none' || this.network.type === 'unknown') {
            this.isConnected = false;
            this.toast.showDisconnected();
        }
        else {
            this.isConnected = true;
        }
        return this.isConnected;
    }

    onConnect() {
        this.onConnectSubscription = this.network.onConnect()
            .subscribe(resp => {
                this.onConnectEmit.emit();
                this.isConnected = true;
                this.toast.dismiss();
            });
    }

    onDisconnect() {
        this.onDisconnectSubscription = this.network.onDisconnect()
            .subscribe(resp => {
                this.isConnected = false;
                this.toast.showDisconnected();
            });
    }
}

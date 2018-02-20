import { Injectable, EventEmitter } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs";
import { ToastService } from "./toast.service";

@Injectable()
export class NetworkService {

    isConnected: boolean;
    onDisconnectSubscription: Subscription;
    onConnectSubscription: Subscription;
    onDisconnect = new EventEmitter();
    onConnect = new EventEmitter();

    constructor(
        private network: Network,
        private toast: ToastService) {
        
        if (this.network.type !== 'none' && this.network.type !== 'unknown') {
            this.isConnected = true;
        }
        else {
            this.isConnected = false;
        }
        if (!this.isConnected) {
            this.toast.showDisconnected();
        }
        this.onDisconnectSubscription = this.network.onDisconnect()
            .subscribe(resp => {
                this.isConnected = false;
                this.toast.showDisconnected();
                this.onDisconnect.emit(this.isConnected);
            });
        this.onConnectSubscription = this.network.onConnect()
            .subscribe(resp => {
                this.isConnected = true;
                this.toast.dismiss();
                this.onConnect.emit(this.isConnected);
            });
    }

    getStatus() {
        return this.isConnected;
    }

    setStatus(isConnected: boolean) {
        this.isConnected = isConnected;
        if (!this.isConnected) {
            this.toast.showDisconnected();
            this.onDisconnect.emit(this.isConnected);
        }
    }
}
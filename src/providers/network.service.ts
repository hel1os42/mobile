import { Injectable, EventEmitter } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs";
import { ToastService } from "./toast.service";
import { Platform } from "ionic-angular";

@Injectable()
export class NetworkService {

    isConnected: boolean;
    onDisconnectSubscription: Subscription;
    onConnectSubscription: Subscription;
    onResumeSubscription: Subscription;
    onDisconnect = new EventEmitter();
    onConnect = new EventEmitter();

    constructor(
        private network: Network,
        private toast: ToastService,
        private platform: Platform) {

        setTimeout(() => {
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
        }, 1000);

        this.onConnectSubscription = this.network.onConnect()
            .subscribe(resp => {
                this.isConnected = true;
                this.toast.dismiss();
                this.onConnect.emit(this.isConnected);
            });

        this.onResumeSubscription = this.platform.resume.subscribe(() => {
            if (this.network.type !== 'none' && this.network.type !== 'unknown') {
                this.isConnected = true;
                this.onConnect.emit(this.isConnected);
            }
            else {
                this.isConnected = false;
                this.onDisconnect.emit(this.isConnected);
            }
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

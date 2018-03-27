import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {

    disconnectedToast;
    isShowed: boolean;

    constructor(
        private toast: ToastController,
        private translate: TranslateService) { }

    show(message: string, isDisconnected?: boolean) {
        let position = isDisconnected ? 'middle' : 'bottom';
        let duration = isDisconnected ? 3000 : 5000;
        let toast = this.toast.create({
            message: message,
            duration: duration,
            position: position,
            dismissOnPageChange: true
        });
        toast.present();
    }

    showDisconnected() {
        if (!this.isShowed) {
            this.isShowed = true;
            this.disconnectedToast = this.toast.create({
                message: 'Internet connection error',
                // position: 'bottom',
                // showCloseButton: true,
                // closeButtonText: 'Close',
                cssClass: 'disconnected',
            });
            this.disconnectedToast.present();
        }
    }

    showNotification(key: string) {   
        this.translate.get(key)
            .subscribe(resp => {
                    let toast = this.toast.create({
            message: resp,
            duration: 1500,
            position: 'middle',
            cssClass: 'notification-toast',
            dismissOnPageChange: true
        });
        toast.present();
            })
    
    }

    dismiss() {
        if (this.isShowed) {
            this.disconnectedToast.dismiss();
            this.disconnectedToast = undefined;
        }
        this.isShowed = false;
    }
}

import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
    constructor(
        private toast: ToastController,
    ) { }

    show(message: string) {
        let toast = this.toast.create({
            message: message,
            duration: 5000,
            position: 'bottom',
            dismissOnPageChange: true
        });
        toast.present();
    }
}

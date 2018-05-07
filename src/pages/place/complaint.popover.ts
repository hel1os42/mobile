import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../providers/toast.service';

@Component({
    selector: 'complaint-popover-component',
    templateUrl: 'complaint.popover.html'
})

export class ComplaintPopover {

    complaint: string;
    keys = [
        'COMPLAINT.STAFF_IS_NOT',
        'COMPLAINT.STAFF_HAS_DENIED',
        'COMPLAINT.DISCOUNT_OR_BONUS',
        'COMPLAINT.OTHER_REASON'
    ];
    isInputVisible: boolean;

    constructor(
        private viewCtrl: ViewController,
        private translate: TranslateService,
        private toast: ToastService) {

    }

    getComplaint(key, i) {
        if (i == 3) {
            // this.complaint = undefined;
            this.isInputVisible = true;
        }
        else {
            let complaintsEn;
            let rootKey = key.split('.')[0];
            let childKey = key.split('.')[1];
            this.translate.getTranslation('en')
                .subscribe(trannslations => {
                    complaintsEn = trannslations[rootKey];
                    this.complaint = complaintsEn[childKey];
                    this.setComplaint();
                })
        }
    }

    setComplaint() {
        if (this.complaint && this.complaint !== '') {
            console.log(this.complaint);//to do
            this.toast.showNotification('COMPLAINT.NOTIFICATION');
            this.close();
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
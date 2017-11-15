import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlaceService } from '../../providers/place.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
    selector: 'page-adv-redeem-offer',
    templateUrl: 'adv-redeem-offer.html'
})
export class AdvRedeemOfferPage {

    code: string;
    options: BarcodeScannerOptions = {
        preferFrontCamera: true,
        orientation: 'portrait'
    };

    constructor(private nav: NavController,
                private place: PlaceService,
                private barcode: BarcodeScanner) {

    }

    scanBarcode() {
        this.barcode.scan()
            .then(res => this.code = res.text);
    }

    sendCode() {
        this.place.setRedeemCode(this.code)
            .subscribe(() => this.nav.pop());
    }

}

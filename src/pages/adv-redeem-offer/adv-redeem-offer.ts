import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Rx';
import { Account } from '../../models/account';
import { Place } from '../../models/place';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { AdvUserOffersPage } from '../adv-user-offers/adv-user-offers';
import { StatisticPage } from '../statistic/statistic';
import { UserNauPage } from '../user-nau/user-nau';

@Component({
    selector: 'page-adv-redeem-offer',
    templateUrl: 'adv-redeem-offer.html'
})

// this page is not used

export class AdvRedeemOfferPage {

    code: string;
    options: BarcodeScannerOptions = {
        preferFrontCamera: true,
        orientation: 'portrait'
    };
    company = new Place();
    balance: number;
    NAU: Account;
    onRefreshPlace: Subscription;
    onRefreshAccounts: Subscription;

    constructor(private nav: NavController,
        private place: PlaceService,
        private barcode: BarcodeScanner,
        private profile: ProfileService) {

        this.company = this.place.company;
        if (!this.balance) {
        this.profile.getWithAccounts()
            .subscribe(resp => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU ? this.NAU.balance : 0;
            })
        }
        this.onRefreshPlace = this.place.onRefreshCompany
            .subscribe(company => {
                this.company = company;
            });

        this.onRefreshAccounts = this.profile.onRefreshAccounts
            .subscribe((resp) => {
                this.NAU = resp.accounts.NAU;
                this.balance = this.NAU.balance;
            })
    }

    scanBarcode() {
        this.barcode.scan()
            .then(res => this.code = res.text);
    }

    confirm() {
        this.place.setRedeemCode(this.code)
            .subscribe((resp) => {
                this.code = '';
                this.profile.refreshAccounts();
                this.nav.pop();

            });
    }

    openUserOffers() {
        this.nav.push(AdvUserOffersPage, { balance: this.balance });
    }

    openUserNau() {
        this.nav.push(UserNauPage, { NAU: this.NAU });
    }

    openStatistic() {
        this.nav.push(StatisticPage);
    }

    ionViewWillUnload() {
        this.onRefreshPlace.unsubscribe();
        this.onRefreshAccounts.unsubscribe();
    }

}

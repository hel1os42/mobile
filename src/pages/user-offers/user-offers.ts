import { Component } from '@angular/core';
import { RedeemedOffer } from '../../models/redeemedOffer';
import { OfferService } from '../../providers/offer.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'page-user-offers',
    templateUrl: 'user-offers.html'
})

export class UserOffersPage {
    offers: RedeemedOffer[];
    total;
    onRefreshOffers: Subscription;

    constructor(
        private offer: OfferService,
        private translate: TranslateService) {

        this.offer.getRedeemedOffers()
            .subscribe(resp => {
                this.offers = resp.offers.reverse();
                if (resp.offers_count == 0) {
                    this.translate.get('PAGE_USER-OFFERS.YOU_HAVE_NOT')
                        .subscribe(resp => {
                            this.total = resp;
                        });
                } else {
                    this.total = resp.offers_count;
                }
            });
        this.onRefreshOffers = this.offer.onRefreshRedeemedOffers
            .subscribe(resp => {
                this.offers = resp.offers.reverse();
                this.total = resp.offers_count;
            })
    }

    ngOnDestroy() {
        this.onRefreshOffers.unsubscribe();
    }

}
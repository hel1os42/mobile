import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfileService } from '../../providers/profile.service';
import { PlaceService } from '../../providers/place.service';
import { ApiService } from '../../providers/api.service';
import { Offer } from '../../models/offer';
import { AdvTabsPage } from '../adv-tabs/adv-tabs';

@Component({
    selector: 'page-create-offer-5',
    templateUrl: 'create-offer-5.html'
})
export class CreateOffer5Page {

    offer: Offer;
    balance = 0;
    reward = '1';
    reserved = '10';
    picture_url: string;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private profile: ProfileService,
        private api: ApiService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        if (this.offer.id) {
            this.reward = this.offer.reward.toString();
            this.reserved = this.offer.reserved.toString();
        }

        this.profile.getWithAccounts()
            .subscribe(user => {
                this.balance = user.accounts.NAU.balance;
            });
    }

    createOffer() {
        this.offer.reward = parseInt(this.reward);
        this.offer.reserved = parseInt(this.reserved);
        if (this.offer.id) {
            this.place.putOffer(this.offer, this.offer.id)
                .subscribe(resp => this.nav.setRoot(AdvTabsPage));
        }
        else {
            this.place.setOffer(this.offer)
                .subscribe(resp => {
                    //console.log(resp.http_headers.get('location'));
                    if (resp.http_headers.get('location') !== null) {
                        let location = resp.http_headers.get('location');
                        let offer_id = location.slice(- location.lastIndexOf('/') + 2);
                        //console.log("locaction: " + location);
                        //console.log("parsing: " + offer_id);

                        if (this.picture_url) {
                            console.log(this.picture_url);
                            this.api.uploadImage(this.picture_url, `offers/${offer_id}/picture`)
                                .then(resut => this.nav.popToRoot());
                        }
                        else {
                            this.nav.popToRoot();
                        }

                    }
                    else {
                        this.nav.popToRoot();
                    }
                })
        }
    }

}

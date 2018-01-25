import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Place } from '../../models/place';
import { Offer } from '../../models/offer';
import { OfferService } from '../../providers/offer.service';
import { PlaceService } from '../../providers/place.service';
import { CreateOffer2Page } from '../create-offer-2/create-offer-2';

@Component({
    selector: 'page-create-offer-1',
    templateUrl: 'create-offer-1.html'
})
export class CreateOffer1Page {

    offer: Offer;
    discounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];//to do
    discount: number = 10;
    isDiscountSelectDisable = true;
    isGiftSelectDisable = true;
    // company = new Place();to do
    company;
    picture_url: string;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private offerService: OfferService,
        private place: PlaceService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        if (!this.offer.id) {
            this.place.getWithCategory()
                .subscribe(company => {
                    this.company = company;
                    this.offerService.getCategory(this.company.categories[0].id)
                        .subscribe(category => this.offer.category_id = category.parent_id !== null ? category.parent_id : this.company.categories[0].id)
                });
        }

    }

    openCreateOffer2Page() {
        if (!this.offer.id) {
            this.offer.longitude = this.company.longitude;
            this.offer.latitude = this.company.latitude;
            this.offer.radius = this.company.radius;
        }

        this.nav.push(CreateOffer2Page, { offer: this.offer, picture: this.picture_url });//add bindings (category & type, type)
    }

    toggleDiscountDisabled(event, isDiscountSelectDisable) {
        this.isDiscountSelectDisable = isDiscountSelectDisable;
        if (event == 'bonus') {
            this.isGiftSelectDisable = false;
        }
        else {
            this.isGiftSelectDisable = true;
        }
    }

}

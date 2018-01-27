import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { PlaceService } from '../../providers/place.service';
import { StringValidator } from '../../validators/string.validator';
import { CreateOffer2Page } from '../create-offer-2/create-offer-2';
import { ToastService } from '../../providers/toast.service';

@Component({
    selector: 'page-create-offer-1',
    templateUrl: 'create-offer-1.html'
})
export class CreateOffer1Page {

    offer: Offer;
    discounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];//to do
    discount: number = 10;
    isDiscountHidden = true;
    isGiftBonusHidden = true;
    company: Place;
    picture_url: string;
    giftBonusDescr: string;
    type: string;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private toast: ToastService) {

        this.offer = this.navParams.get('offer');
        if (this.offer.type) {
            this.type = this.offer.type;
        }
        this.picture_url = this.navParams.get('picture');
        this.place.getWithCategory()
            .subscribe(company => {
                this.company = company;
                if (!this.offer.id) {
                    this.offer.category_id = this.company.category[0].id;
                }
            });
    }

    toggleDiscountDisabled(event, isDiscountSelectDisable) {
        this.isDiscountHidden = isDiscountSelectDisable;
        if (event === 'bonus' || event === 'gift') {
            this.isGiftBonusHidden = false;
        }
        else {
            this.isGiftBonusHidden = true;
        }
        this.type = event;
    }

    updateAmount(event) {
        StringValidator.stringAmountLimit(event);
    }

    validate() {
        if (!this.type) {// to do
            this.toast.show('Please, set offer type with description!');
            return false;
        }
        else {
            return true;
        }
    }

    openCreateOffer2Page() {
        if (this.validate()) {
            this.offer.type = this.type;
            if (this.offer.type === 'gift' || this.offer.type === 'bonus') {
                this.offer.gift_bonus_descr = this.giftBonusDescr;
            }
            if (!this.offer.id) {
                this.offer.longitude = this.company.longitude;
                this.offer.latitude = this.company.latitude;
                this.offer.radius = this.company.radius;
            }
            this.nav.push(CreateOffer2Page, { offer: this.offer, picture: this.picture_url });//add bindings (category & type, type)
        }
    }

}

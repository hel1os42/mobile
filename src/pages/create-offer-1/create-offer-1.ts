import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { Place } from '../../models/place';
import { PlaceService } from '../../providers/place.service';
import { ToastService } from '../../providers/toast.service';
import { CreateOffer2Page } from '../create-offer-2/create-offer-2';

@Component({
    selector: 'page-create-offer-1',
    templateUrl: 'create-offer-1.html'
})

// this page is not used

export class CreateOffer1Page {

    offer: Offer;
    isDiscountHidden = true;
    isGiftBonusHidden = true;
    company: Place;
    picture_url: string;
    giftBonusDescr: string;
    type: string;
    formDiscount: FormGroup;
    // currencyCode: string;
    // currencies = CURRENCIES;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private toast: ToastService,
        private builder: FormBuilder) {

        this.offer = this.navParams.get('offer');
        if (this.offer.type) {
            this.type = this.offer.type;
            if (this.offer.type === 'discount' && this.offer.discount_percent) {
                this.isDiscountHidden = false;
            }
            if ((this.offer.type === 'gift' || this.offer.type === 'bonus') && this.offer.discount_percent) {
                this.isGiftBonusHidden = false;
            }
        }
        this.picture_url = this.navParams.get('picture');
        this.place.getWithCategory()
            .subscribe(company => {
                this.company = company;
                if (!this.offer.id) {
                    this.offer.category_id = this.company.category[0].id;
                }
            });

        this.formDiscount = this.builder.group({
            percent: new FormControl(this.offer.discount_percent ? this.offer.discount_percent : '', Validators.compose([
                Validators.min(0.01),
                Validators.max(99.99),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
            srartPrice: new FormControl(this.offer.discount_start_price ? this.offer.discount_start_price : '', Validators.compose([
                Validators.min(0.01),
                Validators.max(9999999999.99),
            ])),
        });
    }

    toggleDiscountDisabled(event, isDiscountSelectDisable) {
        this.isDiscountHidden = isDiscountSelectDisable;
        if (event === 'bonus' || event === 'gift') {
            this.isGiftBonusHidden = false;
        } else {
            this.isGiftBonusHidden = true;
        }
        this.type = event;
    }

    validate() {
        if (this.type === 'discount') {
            if (this.formDiscount.controls.percent.invalid) {
                this.toast.show('Please, set valid percent value!');
                return false;
            } else {
                if (this.formDiscount.controls.srartPrice.invalid) {
                    this.toast.show('Please, set  valid price value!');
                    return false;
                }
                // if (this.formDiscount.value.srartPrice && this.formDiscount.controls.srartPrice.valid && !this.currencyCode) {
                //     this.toast.show('Please, set currency!');
                //     return false;
                // }
                else return true;
            }

        } else {
            if (this.type === 'bonus' || this.type === 'gift') {

                if (!this.giftBonusDescr || this.giftBonusDescr === '') {
                    let type = this.type === 'bonus' ? 'bonus' : 'gift';
                    this.toast.show(`Please, set ${type} description!`);
                    return false;
                }
                else return true;

            }
            else return true;
        }
    }

    openCreateOffer2Page() {
        if (this.validate()) {
            this.offer.type = this.type;
            if (this.offer.type === 'gift' || this.offer.type === 'bonus') {
                this.offer.gift_bonus_descr = this.giftBonusDescr;
                this.offer.discount_percent = undefined;
                this.offer.discount_start_price = undefined;
                this.offer.discount_start_price = undefined;
            }
            if (this.offer.type === 'discount') {
                this.offer.discount_percent = parseFloat(this.formDiscount.value.percent);
                this.offer.discount_start_price = parseFloat(this.formDiscount.value.price)
                    ? parseFloat(this.formDiscount.value.price)
                    : undefined;
                // this.offer.currency = this.currencyCode;
                this.offer.gift_bonus_descr = undefined;
            }
            if (this.offer.type = 'second_free') {
                this.offer.discount_percent = undefined;
                this.offer.discount_start_price = undefined;
                this.offer.discount_start_price = undefined;
                this.offer.gift_bonus_descr = undefined;
            }
            if (!this.offer.id) {
                this.offer.longitude = this.company.longitude;
                this.offer.latitude = this.company.latitude;
                this.offer.radius = this.company.radius;
            }
            this.nav.push(CreateOffer2Page, { offer: this.offer, picture: this.picture_url });
        }
    }

}

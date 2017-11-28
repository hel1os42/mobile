import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { ToastService } from '../../providers/toast.service';
import { CreateOffer5Page } from '../create-offer-5/create-offer-5';

@Component({
    selector: 'page-create-offer-4',
    templateUrl: 'create-offer-4.html'
})
export class CreateOffer4Page {

    offer: Offer;
    levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    level = 1;
    picture_url: string;
    maxData: FormGroup;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private toast: ToastService,
        private builder: FormBuilder) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');

        this.maxData = this.builder.group({
            maxCount: [this.offer.max_count],
            dayMaxCount: [this.offer.max_per_day],
            maxForUser: [this.offer.max_for_user],
            maxForUserPerDay: [this.offer.max_for_user_per_day],
            maxForUserPerWeek: [this.offer.max_for_user_per_week],
            maxForUserPerMonth: [this.offer.max_for_user_per_month],
        })
    }

    validateMaxForUser() {
        let maxForUser = parseInt(this.maxData.value.maxForUser);
        let maxForUserPerDay = parseInt(this.maxData.value.maxForUserPerDay);
        let maxForUserPerWeek = parseInt(this.maxData.value.maxForUserPerWeek);
        let maxForUserPerMonth = parseInt(this.maxData.value.maxForUserPerMonth);

        if (maxForUser >= 0 && (maxForUserPerDay > 0 && maxForUserPerDay > maxForUser) ||
            (maxForUserPerWeek > 0 && maxForUserPerWeek > maxForUser) ||
            (maxForUserPerMonth > 0 && maxForUserPerMonth > maxForUser)) {
            this.toast.show('Max for user valid should be less than max for user overall');
            return false;
        };
        return true;
    }

    validateMax() {
        let maxCount = parseInt(this.maxData.value.maxCount);
        let dayMaxCount = parseInt(this.maxData.value.dayMaxCount);

        if (maxCount >= 0 && dayMaxCount > 0 && dayMaxCount > maxCount) {
            this.toast.show('Day max valid should be less than max overall');
            return false;
        };
        return true;
    }

    validateBetween() {
        let maxCount = parseInt(this.maxData.value.maxCount);
        let dayMaxCount = parseInt(this.maxData.value.dayMaxCount);
        let maxForUser = parseInt(this.maxData.value.maxForUser);
        let maxForUserPerDay = parseInt(this.maxData.value.maxForUserPerDay);

        if ((maxCount >= 0 && maxForUser > 0 && maxForUser > maxCount) ||
            (dayMaxCount >= 0 && maxForUserPerDay > 0 && maxForUserPerDay > dayMaxCount)) {
            this.toast.show('Max for user valid should be less than max overall');
            return false;
        };
        return true;
    }

    updateList(ev) {
        ev.target.value = ev.target.value.replace(/D/g, '');
    }

    limitStr(key) {
        this.maxData.valueChanges.subscribe(data => {
            if (data[key].length > 18) {
                this.maxData.controls[key].setValue(data[key].slice(0, 18));
            }
        })
    }

    openCreateOffer5Page() {
        if (this.validateMaxForUser() && this.validateMax() && this.validateBetween()) {
            this.offer.user_level_min = this.level;
            if (this.maxData.value.maxCount) {
                this.offer.max_count = parseInt(this.maxData.value.maxCount);
            }
            if (this.maxData.value.dayMaxCount) {
                this.offer.max_per_day = parseInt(this.maxData.value.dayMaxCount);
            }
            if (this.maxData.value.maxForUser) {
                this.offer.max_for_user = parseInt(this.maxData.value.maxForUser);
            }
            if (this.maxData.value.maxForUserPerDay) {
                this.offer.max_for_user_per_day = parseInt(this.maxData.value.maxForUserPerDay);
            }
            if (this.maxData.value.maxForUserPerWeek) {
                this.offer.max_for_user_per_week = parseInt(this.maxData.value.maxForUserPerWeek);
            }
            if (this.maxData.value.maxForUserPerMonth) {
                this.offer.max_for_user_per_month = parseInt(this.maxData.value.maxForUserPerMonth);
            }
            this.nav.push(CreateOffer5Page, { offer: this.offer, picture: this.picture_url });
        }
    }
}

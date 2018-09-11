import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { ToastService } from '../../providers/toast.service';
import { NamberValidator } from '../../validators/number.validator';
import { StringValidator } from '../../validators/string.validator';
import { CreateOffer5Page } from '../create-offer-5/create-offer-5';

@Component({
    selector: 'page-create-offer-4',
    templateUrl: 'create-offer-4.html'
})

// this page is not used

export class CreateOffer4Page {

    offer: Offer;
    levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    level = 1;
    picture_url: string;
    formData: FormGroup;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private toast: ToastService,
        private builder: FormBuilder) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');

        this.formData = this.builder.group({
            maxCount: new FormControl(this.offer.max_count, NamberValidator.min(1)),
            dayMaxCount: new FormControl(this.offer.max_per_day, NamberValidator.min(1)),
            maxForUser: new FormControl(this.offer.max_for_user, NamberValidator.min(1)),
            maxForUserPerDay: new FormControl(this.offer.max_for_user_per_day, NamberValidator.min(1)),
            maxForUserPerWeek: new FormControl(this.offer.max_for_user_per_week, NamberValidator.min(1)),
            maxForUserPerMonth: new FormControl(this.offer.max_for_user_per_month, NamberValidator.min(1))
        })
    }

    validateMaxForUser() {
        let maxForUser = parseInt(this.formData.value.maxForUser);
        let maxForUserPerDay = parseInt(this.formData.value.maxForUserPerDay);
        let maxForUserPerWeek = parseInt(this.formData.value.maxForUserPerWeek);
        let maxForUserPerMonth = parseInt(this.formData.value.maxForUserPerMonth);

        if (maxForUser >= 0 && (maxForUserPerDay > 0 && maxForUserPerDay > maxForUser) ||
            (maxForUserPerWeek > 0 && maxForUserPerWeek > maxForUser) ||
            (maxForUserPerMonth > 0 && maxForUserPerMonth > maxForUser)) {
            this.toast.show('Maximum amount of redemptions by user \nfor definite period should be less than overall');
            return false;
        };
        return true;
    }

    validateMax() {
        let maxCount = parseInt(this.formData.value.maxCount);
        let dayMaxCount = parseInt(this.formData.value.dayMaxCount);

        if (maxCount >= 0 && dayMaxCount > 0 && dayMaxCount > maxCount) {
            this.toast.show('Daily redemptions amount \nshould be less than overall');
            return false;
        };
        return true;
    }

    validateBetween() {
        let maxCount = parseInt(this.formData.value.maxCount);
        let dayMaxCount = parseInt(this.formData.value.dayMaxCount);
        let maxForUser = parseInt(this.formData.value.maxForUser);
        let maxForUserPerDay = parseInt(this.formData.value.maxForUserPerDay);

        if ((maxCount >= 0 && maxForUser > 0 && maxForUser > maxCount) ||
            (dayMaxCount >= 0 && maxForUserPerDay > 0 && maxForUserPerDay > dayMaxCount)) {
            this.toast.show('Maximum amount of redemptions by user \nshould be less than overall');
            return false;
        };
        return true;
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    limitStr(key) {
        this.formData.valueChanges.subscribe(data => {
            if (data[key].length > 10) {
                this.formData.controls[key].setValue(data[key].slice(0, 10));
            }
        })
    }

    openCreateOffer5Page() {
        if (this.validateMaxForUser() && this.validateMax() && this.validateBetween()) {
            this.offer.user_level_min = this.level;
            if (this.formData.value.maxCount) {
                this.offer.max_count = parseInt(this.formData.value.maxCount);
            }
            if (this.formData.value.dayMaxCount) {
                this.offer.max_per_day = parseInt(this.formData.value.dayMaxCount);
            }
            if (this.formData.value.maxForUser) {
                this.offer.max_for_user = parseInt(this.formData.value.maxForUser);
            }
            if (this.formData.value.maxForUserPerDay) {
                this.offer.max_for_user_per_day = parseInt(this.formData.value.maxForUserPerDay);
            }
            if (this.formData.value.maxForUserPerWeek) {
                this.offer.max_for_user_per_week = parseInt(this.formData.value.maxForUserPerWeek);
            }
            if (this.formData.value.maxForUserPerMonth) {
                this.offer.max_for_user_per_month = parseInt(this.formData.value.maxForUserPerMonth);
            }
            this.nav.push(CreateOffer5Page, { offer: this.offer, picture: this.picture_url });
        }
    }
}

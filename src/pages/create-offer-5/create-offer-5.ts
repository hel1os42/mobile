import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { ApiService } from '../../providers/api.service';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';
import { ToastService } from '../../providers/toast.service';
import { StringValidator } from '../../validators/string.validator';

@Component({
    selector: 'page-create-offer-5',
    templateUrl: 'create-offer-5.html'
})

// this page is not used

export class CreateOffer5Page {

    offer: Offer;
    balance = 0;
    reward = '1';
    reserved = '10';
    picture_url: string;
    timer;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private profile: ProfileService,
        private api: ApiService,
        private loading: LoadingController,
        private alert: AlertController,
        private toast: ToastService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');

        if (this.offer.id) {
            this.reward = this.offer.reward.toString();
            this.reserved = this.offer.reserved.toString();
        }

        this.profile.getWithAccounts()
            .subscribe(user => this.balance = user.accounts.length > 0 ? user.accounts.NAU.balance : 0);
    }

    createOffer() {
        if (this.validate()) {
            this.offer.reward = parseInt(this.reward);
            this.offer.reserved = parseInt(this.reserved);
            this.place.setOffer(this.offer)
                .subscribe(resp => {
                    let location = resp.http_headers.get('location');
                    // let offer_id = location.slice(- location.lastIndexOf('/') + 2);
                    let offer_id = location.split('offers/')[1];
                    let loading = this.loading.create({ content: 'Creating your offer...', spinner: 'bubbles' });
                    loading.present();
                    this.timer = setInterval(() => {

                        this.place.getOffer(offer_id)
                            .subscribe(offer => {

                                if (offer.id) {
                                    this.place.refreshPlace();

                                    let promise = this.picture_url
                                        ? this.api.uploadImage(this.picture_url, `offers/${offer_id}/picture`, false)
                                        : Promise.resolve();

                                    promise.then((res) => {
                                        console.log(res);
                                        this.stopTimer();
                                        loading.dismiss();
                                        this.navTo();
                                    }).catch(t => console.log(t.error()));
                                }

                            });
                    }, 1500)
                }, err => this.presentConfirm('created'))
        }
    }

    updateOffer() {
        if (this.validate()) {
            this.offer.reward = parseInt(this.reward);
            this.offer.reserved = parseInt(this.reserved);
            this.place.putOffer(this.offer, this.offer.id)
                .subscribe(() => {
                    let loading = this.loading.create({ content: 'Updating offer...', spinner: 'bubbles' });
                    loading.present();
                    let promise = this.picture_url
                        ? this.api.uploadImage(this.picture_url, `offers/${this.offer.id}/picture`, false)
                        : Promise.resolve();

                    promise.then(() => {
                        loading.dismiss();
                        this.navTo();
                    })
                },
                    err => this.presentConfirm('updated')
                );
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    presentConfirm(action: string) {
        let isUpdate = action == 'updated' ? true : false;
        let subTitle = isUpdate ?
            `Offer wasn't update. Please try again` :
            `Offer wasn't create. Please try again`;
        let alert = this.alert.create({
            title: 'Oops...ERROR',
            subTitle: subTitle,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // this.nav.setRoot(this.nav.first().component);
                    }
                },
                {
                    text: 'Retry',
                    handler: () => {
                        isUpdate ? this.updateOffer() : this.createOffer();
                    }
                }
            ]

        });
        alert.present();
    }

    navTo() {
        this.nav.setRoot(this.nav.first().component).then(() => {
            this.nav.parent.select(4);
            this.place.refreshOffersList();
            // this.nav.first();
        })
    }

    limitStr(str, length) {
        if (length == 9) this.reward = StringValidator.stringLimitMax(str, length);
        else this.reserved = StringValidator.stringLimitMax(str, length);
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    validate() {
        let reserved = parseInt(this.reserved);
        let reward = parseInt(this.reward);
        if (reserved > 0 && reward > 0 && reserved < reward * 10) {
            this.toast.show('Reserved tokens should be \nat least 10 times larger than a reward');
            return false;
        }
        if (reserved > 0 && reward > 0 && reserved % reward > 0) {
            this.toast.show('Reserved tokens and reward should be multiple');
            return false;
        }
        else {
            return true;
        }
    }

    disable() {
        return parseInt(this.reserved) <= 0 || parseInt(this.reward) <= 0 || this.reserved == '' || this.reward == '';
    }

}

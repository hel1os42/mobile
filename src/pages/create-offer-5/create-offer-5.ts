import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { ApiService } from '../../providers/api.service';
import { PlaceService } from '../../providers/place.service';
import { ProfileService } from '../../providers/profile.service';

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
    timer;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private profile: ProfileService,
        private api: ApiService,
        private loading: LoadingController,
        private alert: AlertController,
        private viewCtrl: ViewController) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        if (this.offer.id) {
            this.reward = this.offer.reward.toString();
            this.reserved = this.offer.reserved.toString();
        }

        this.profile.getWithAccounts()
            .subscribe(user => this.balance = user.accounts.NAU.balance);
    }

    createOffer() {
        this.offer.reward = parseInt(this.reward);
        this.offer.reserved = parseInt(this.reserved);

        this.place.setOffer(this.offer)
            .subscribe(resp => {
                let location = resp.http_headers.get('location');
                let offer_id = location.slice(- location.lastIndexOf('/') + 2);
                let loading = this.loading.create({ content: 'Creating your offer...' });
                
                loading.present();
                this.timer = setInterval(() => {

                    this.place.getOffer(offer_id, false)
                        .subscribe(offer => {
                            if (offer) {
                                if (this.picture_url) {
                                    this.api.uploadImage(this.picture_url, `offers/${offer_id}/picture`)
                                        .then(res => {
                                            this.stopTimer();
                                            loading.dismiss()
                                            this.navTo();
                                        });
                                }
                                else { 
                                    this.stopTimer();
                                    loading.dismiss();
                                    this.navTo();
                                }
                            }
                        });
                }, 1500)
            }, err => this.presentConfirm('created'))
    }

    updateOffer() {
        this.offer.reward = parseInt(this.reward);
        this.offer.reserved = parseInt(this.reserved);
        this.place.putOffer(this.offer, this.offer.id)
            .subscribe(resp => {
                if (this.picture_url) {
                    let loading = this.loading.create({ content: 'Updeting offer...' });
                    loading.present();
                    this.api.uploadImage(this.picture_url, `offers/${this.offer.id}/picture`)
                        .then(resut => {
                            loading.dismiss();
                            this.navTo();
                        });
                }
                else {
                    this.navTo();
                }
            },
            err => this.presentConfirm('updated')
            );
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    presentConfirm(action: string) {
        let isUpdate = action == 'updated' ? true : false;
        let alert = this.alert.create({
            title: 'Oops...ERROR',
            subTitle: `Offer wasn't ${action}. Please try again`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.nav.setRoot(this.nav.first().component);
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
            this.nav.first();
        })
    }
}

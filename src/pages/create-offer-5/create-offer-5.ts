import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { User } from '../../models/user';
import { ProfileService } from '../../providers/profile.service';
import { PlaceService } from '../../providers/place.service';
import { ApiService } from '../../providers/api.service';

@Component({
    selector: 'page-create-offer-5',
    templateUrl: 'create-offer-5.html'
})
export class CreateOffer5Page {

    offer: OfferCreate;
    user = new User();
    balance: number = 0;
    rewards: number[] = [10, 20, 30, 40, 50, 60, 70];
    reward: number = 10;
    tokens: number[] = [15, 20 , 25, 30, 35, 40 , 45, 55];
    token = 55;
    picture_url: string;

    constructor(private nav: NavController,
        private navParams: NavParams,
        private place: PlaceService,
        private profile: ProfileService,
        private api: ApiService) {

        this.offer = this.navParams.get('offer');
        this.picture_url = this.navParams.get('picture');
        this.profile.getWithAccounts()//to do from service
            .subscribe(user => {
                this.user = user;
                this.balance = this.user.accounts.NAU.balance;
            });
        }

    createOffer() {
        this.offer.reward = this.reward;
        this.place.setOffer(this.offer)
            .subscribe(resp => {
                if(this.picture_url) {
                    this.api.uploadImage(this.picture_url, `offers/${resp.id}/picture`)
                        .then(resut => this.nav.popToRoot())
                }
                else {
                    this.nav.popToRoot()
                }
            })
            debugger
    }

}

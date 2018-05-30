import { Place } from '../../models/place';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { ProfileService } from '../../providers/profile.service';
import { TestimonialsService } from '../../providers/testimonials.service';
import { TestimonialCreate } from '../../models/testimonialCreate';

@Component({
    selector: 'congratulation-popover-component',
    templateUrl: 'congratulation.popover.html'
})

export class CongratulationPopover {

    company: Place;
    offer: Offer;
    branchDomain = 'https://nau.app.link';
    stars = 4;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private profile: ProfileService,
        private testimonials: TestimonialsService) {

        this.company = this.navParams.get('company');
        this.offer = this.navParams.get('offer');
    }

    getStars() {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(this.stars > i);
        }
        return showStars;
    }

    setStars(i) {
        this.stars = i + 1;
    }

    send() {
        let testimonial: TestimonialCreate = {
            stars: this.stars
        }
        this.testimonials.post(this.company.id, testimonial)
            .subscribe(resp => {
                // let status = resp ? resp.status : '';
                this.viewCtrl.dismiss();
            })
    }

    shareOffer() {
        const Branch = window['Branch'];
        this.profile.get(false)
            .subscribe(profile => {
                let properties = {
                    canonicalIdentifier: `?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                    canonicalUrl: `${this.branchDomain}/?invite_code=${profile.invite_code}&page=place&placeId=${this.company.id}&offerId=${this.offer.id}`,
                    title: this.offer.label,
                    contentDescription: this.offer.description,
                    contentImageUrl: this.offer.picture_url + '?size=mobile',
                    // price: 12.12,
                    // currency: 'GBD',
                    contentIndexingMode: 'private',
                    contentMetadata: {
                        page: 'offer',
                        invite_code: profile.invite_code,
                        placeId: this.company.id,
                        offerId: this.offer.id
                    }
                };
                var branchUniversalObj = null;
                Branch.createBranchUniversalObject(properties)
                    .then(res => {
                        branchUniversalObj = res;
                        let analytics = {};
                        // let message = this.company.name + this.company.description
                        let message = 'NAU';
                        branchUniversalObj.showShareSheet(analytics, properties, message)
                            .then(resp => console.log(resp))
                    }).catch(function (err) {
                        console.log('Branch create obj error: ' + JSON.stringify(err))
                    })

            })
    }
}
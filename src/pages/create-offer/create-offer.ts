import { Component } from '@angular/core';
import { LocationService } from '../../providers/location.service';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController, App, PopoverController } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { OfferService } from '../../providers/offer.service';
import { ProfileService } from '../../providers/profile.service';
import { OfferCategory } from '../../models/offerCategory';
import { CreateOfferPopover } from '../create-offer/createOffer.popover'
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    message: string;
    coords = new Coords();
    offer = new OfferCreate();

    constructor(private location: LocationService,
                private nav: NavController,
                private offerService: OfferService,
                private profileService: ProfileService,
                private app: App,
                private popoverCtrl: PopoverController) {

        this.offerService.getOfferCreate()
            .subscribe(resp => this.offer = resp);

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
            })
            .catch((error) => {
                this.message = error.message;
            });
    }

    // ionViewDidLoad() {
    //     // let popover = this.popoverCtrl.create(CreateOfferPopover);
    //     // popover.present();
    // }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer });
    }

}

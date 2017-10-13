import { Component } from '@angular/core';
import { LocationService } from '../../providers/location.service';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController, PopoverController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { ProfileService } from '../../providers/profile.service';
import { OfferCategory } from '../../models/offerCategory';
import { CreateOfferPopover } from '../create-offer/createOffer.popover'
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';
import { PlaceService } from '../../providers/place.service';

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
                private place: PlaceService,
                private profileService: ProfileService,
                private popoverCtrl: PopoverController) {

        this.place.getOfferCreate()
            .subscribe(resp => this.offer = resp);
        
            }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer});
    }

}

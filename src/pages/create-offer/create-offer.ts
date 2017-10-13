import { Component } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
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

    constructor(private nav: NavController,
                private place: PlaceService) {

        this.place.getOfferCreate()
            .subscribe(resp => this.offer = resp);
        
            }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer});
    }

}

import { Component } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { OfferCategory } from '../../models/offerCategory';
import { CreateOfferPopover } from '../create-offer/createOffer.popover'
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';
import { PlaceService } from '../../providers/place.service';
import { ImagePicker } from '@ionic-native/image-picker'

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    message: string;
    coords = new Coords();
    offer = new OfferCreate();

    constructor(
        private nav: NavController,
        private place: PlaceService,
        private imagePicker: ImagePicker) {

        this.place.getOfferCreate()
            .subscribe(resp => this.offer = resp);

            }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer});
    }

    addPicture() {
        this.imagePicker.getPictures({
            maximumImagesCount: 1
        }).then((results) => {
            debugger;
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
            }
        }, (err) => { console.error(err) });
    }
}

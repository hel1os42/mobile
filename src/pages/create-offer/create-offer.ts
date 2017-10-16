import { Component } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { OfferCategory } from '../../models/offerCategory';
import { CreateOfferPopover } from '../create-offer/createOffer.popover'
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';
import { PlaceService } from '../../providers/place.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { ToastService } from '../../providers/toast.service';

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
        private toast: ToastService,
        private imagePicker: ImagePicker) {

        this.place.getOfferCreate()
            .subscribe(resp => this.offer = resp);

            }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer});
    }

    addPicture() {
        let options = { maximumImagesCount: 1 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.offer.picture_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }
}

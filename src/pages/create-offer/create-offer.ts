import { Component } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { Coords } from '../../models/coords';
import { NavController, NavParams } from 'ionic-angular';
import { OfferCreate } from '../../models/offerCreate';
import { CreateOfferPopover } from '../create-offer/createOffer.popover'
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';
import { PlaceService } from '../../providers/place.service';
import { ImagePicker } from '@ionic-native/image-picker';
import { ToastService } from '../../providers/toast.service';
import { Offer } from '../../models/offer';

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    message: string;
    offer = new Offer();
    picture_url: string;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private place: PlaceService,
                private toast: ToastService,
                private imagePicker: ImagePicker) {

        if (this.navParams.get('offer')) {
                this.offer = this.navParams.get('offer');
            debugger
        }

    }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer, picture: this.picture_url });
    }

    addPicture() {
        let options = { maximumImagesCount: 1 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.picture_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }
}

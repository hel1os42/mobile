import { Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { PlaceService } from '../../providers/place.service';
import { ToastService } from '../../providers/toast.service';
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { spaceValidator } from '../../app/validators/string.validator';

@Component({
    selector: 'page-create-offer',
    templateUrl: 'create-offer.html'
})
export class CreateOfferPage {
    message: string;
    offer = new Offer();
    picture_url: string;
    formData: FormGroup;
    regStr = '"\\s+", "g"';

    constructor(private nav: NavController,
                private navParams: NavParams,
                private place: PlaceService,
                private toast: ToastService,
                private imagePicker: ImagePicker,
                private builder: FormBuilder) {

        if (this.navParams.get('offer')) {
            this.offer = this.navParams.get('offer');
        }


        this.formData = this.builder.group({
            offer_name: new FormControl('', Validators.compose([
                spaceValidator.validString,
                Validators.maxLength(30),
                Validators.minLength(3),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
            offer_description: new FormControl('', Validators.compose([
                spaceValidator.validString,
                Validators.maxLength(250),
                Validators.minLength(3),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
        });
    }

    openCreateOffer1Page() {
        this.nav.push(CreateOffer1Page, { offer: this.offer, picture: this.picture_url });
    }

    addPicture() {
        let options = { maximumImagesCount: 1, width: 600, height: 600, quality: 75 };
        this.imagePicker.getPictures(options)
            .then(results => {
                this.picture_url = results[0];
            })
            .catch(err => {
                this.toast.show(JSON.stringify(err));
            });
    }
}

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';
import { PlaceService } from '../../providers/place.service';
import { ToastService } from '../../providers/toast.service';
import { StringValidator } from '../../validators/string.validator';
import { CreateOffer1Page } from '../create-offer-1/create-offer-1';

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
        else {
            this.offer.label = '';
            this.offer.description = '';
        }


        this.formData = this.builder.group({
            offerLabel: new FormControl(this.offer.label, Validators.compose([
                StringValidator.validString,
                Validators.maxLength(30),
                Validators.minLength(3),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
            offerDescription: new FormControl(this.offer.description, Validators.compose([
                StringValidator.validString,
                Validators.maxLength(250),
                Validators.minLength(3),
                //Validators.pattern(/a-zA-Z0-9/),
                Validators.required
            ])),
        });
    }

    openCreateOffer1Page() {
        this.offer.label = this.formData.value.offerLabel;
        this.offer.description = this.formData.value.offerDescription;
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

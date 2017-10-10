import { Component } from '@angular/core';
import { LocationService } from "../../providers/location.service";
import { Coords } from "../../models/coords";
import { AdvUserProfilePage } from "../adv-user-profile/adv-user-profile";
import { NavController, PopoverController } from "ionic-angular";
import { OfferCategory } from '../../models/offerCategory';
import { ApiService } from '../../providers/api.service';
import { CreateAdvUserProfilePopover } from './create-advUser-profile.popover';
import * as _ from 'lodash';
import { OfferService } from '../../providers/offer.service';

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;
    rootCategories: OfferCategory[] = OfferCategory.StaticList;
    selectRootCategories: any[];
    selectedRootCategories: any[];
    selectedRootcategory = [{name: ''}];
    categoryName = 'Choose category';

    constructor(
        private location: LocationService,
        private nav: NavController,
        private popoverCtrl: PopoverController,
        private api: ApiService,
        private offer: OfferService) {

        this.location.get()
            .then((resp) => {
                this.coords = {
                    lat: resp.coords.latitude,
                    lng: resp.coords.longitude
                };
            })
            .catch((error) => {
                this.message = error.message;
                console.log(this.message);
            });

        this.selectRootCategories = this.rootCategories.map(p => p.id);
        for (let i = 0; i < this.rootCategories.length; i++) {
            this.selectRootCategories[i] = ({
                categoryId: this.rootCategories[i].id,
                name: this.rootCategories[i].name,
                img: this.rootCategories[i].imageAdvCreate_url,
                isSelected: false
            });
        }
    }
    
    chooseCategory() {

        let popover = this.popoverCtrl.create(CreateAdvUserProfilePopover, {
            rootCategories: this.selectedRootCategories ? this.selectedRootCategories : this.selectRootCategories
        });
        popover.present();
        popover.onDidDismiss(selectRootCategories => {
            this.selectedRootCategories = selectRootCategories;
            this.selectedRootcategory = selectRootCategories.filter(p => p.isSelected);
            this.categoryName = this.selectedRootcategory.length > 0 ? this.selectedRootcategory[0].name : "Choose category";
            debugger
        })
    }

    createAccount() {

        this.nav.push(AdvUserProfilePage);
    }
}
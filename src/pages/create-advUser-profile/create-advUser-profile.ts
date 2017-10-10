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
import { SelectedCategory } from '../../models/selectCategory';

@Component({
    selector: 'page-create-advUser-profile',
    templateUrl: 'create-advUser-profile.html'
})

export class CreateAdvUserProfilePage {
    coords: Coords = new Coords();
    message: string;
    categories: OfferCategory[] = OfferCategory.StaticList;    
    selectedCategory: SelectedCategory;
    selectedChildCategories: SelectedCategory[];

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
            });
    }
    
    showCategoriesPopover() {
        let popover = this.popoverCtrl.create(CreateAdvUserProfilePopover, {
            categories: this.categories.map(p => {
                return {
                    id: p.id,
                    name: p.name,
                    image_url: p.imageAdvCreate_url,
                    isSelected: this.selectedCategory && p.id == this.selectedCategory.id
                }
            })
        });
        
        popover.present();

        popover.onDidDismiss(categories => {
            if (!categories)
                return;
            
            let selectedCategories: SelectedCategory[] = categories.filter(p => p.isSelected);
            if (selectedCategories.length > 0) {
                this.selectedCategory = selectedCategories[0];
            }
        })
    }

    createAccount() {
        this.nav.push(AdvUserProfilePage);
    }
}
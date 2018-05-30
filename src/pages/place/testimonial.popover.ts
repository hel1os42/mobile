import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { ToastService } from '../../providers/toast.service';
import { TestimonialCreate } from '../../models/testimonialCreate';
import { TestimonialsService } from '../../providers/testimonials.service';

@Component({
    selector: 'testimonial-popover-component',
    templateUrl: 'testimonial.popover.html'
})

export class TestimonialPopover {

    companyId: string;
    stars = 4;
    text: string;
    
    constructor(
        private viewCtrl: ViewController,
        private toast: ToastService,
        private navParams: NavParams,
        private testimonials: TestimonialsService) {

        this.companyId = this.navParams.get('companyId');
    }

    getStars() {
        let showStars: boolean[] = [];
        for (var i = 0; i < 5; i++) {
            showStars.push(this.stars > i);
        }
        return showStars;
    }

    setStars(i) {
        this.stars = i + 1;
    }

    setTestimonial() {
        let testimonial: TestimonialCreate = {
            stars: this.stars,
            text: this.text && this.text.length >= 3 ? this.text : undefined
        }
        this.testimonials.post(this.companyId, testimonial)
            .subscribe(resp => {
                //to do
                this.viewCtrl.dismiss({ isAdded: true });
                this.toast.showNotification('TOAST.ADDED_TO_TESTIMONIALS');
            })
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
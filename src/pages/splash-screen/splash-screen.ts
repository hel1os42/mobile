import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { SettingsPage } from "../settings/settings";

@Component({
    selector: 'page-splash-screen',
    templateUrl: 'splash-screen.html'
})
export class SplashScreenPage {

    @ViewChild('slides') slides: Slides;
    @ViewChild('slidesNews') slidesNews: Slides;
    constructor(private nav: NavController) {
    }

    openSettings() {
        this.nav.push(SettingsPage);
    }

    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }

    slideNewsNext() {
        this.slidesNews.slideNext();
    }

    slideNewsPrev() {
        this.slidesNews.slidePrev();
    }


}
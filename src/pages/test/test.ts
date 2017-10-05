import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from "ionic-angular";

@Component({
    selector: 'page-test',
    templateUrl: 'test.html'
})
export class TestPage {

    @ViewChild(Slides) slides: Slides;

    constructor(
        private nav: NavController) {

    }
    slideNext() {
        this.slides.slideNext();
    }

    slidePrev() {
        this.slides.slidePrev();
    }
}
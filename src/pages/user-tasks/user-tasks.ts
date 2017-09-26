import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

@Component({
    selector: 'page-user-tasks',
    templateUrl: 'user-tasks.html'
})
export class UserTasksPage {

    seg;

    constructor(
        private nav: NavController) {
        this.seg = "active";
    }
}
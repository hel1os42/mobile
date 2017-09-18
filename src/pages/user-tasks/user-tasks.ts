import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

@Component({
    selector: 'page-user-tasks',
    templateUrl: 'user-tasks.html'
})
export class UserTasksPage {

    constructor(
        private nav: NavController) {

    }
}
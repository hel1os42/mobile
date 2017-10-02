import { Component } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { User } from '../../models/user';

@Component({
    selector: 'page-user-tasks',
    templateUrl: 'user-tasks.html'
})
export class UserTasksPage {

    user: User = new User();
    seg;

    constructor(
        private nav: NavController,
        private navParams: NavParams) {

        this.seg = "active";
        this.user = this.navParams.get('user');

    }
}
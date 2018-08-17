import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";
import { User } from '../../models/user';

@Component({
    selector: 'page-user-tasks',
    templateUrl: 'user-tasks.html'
})

// this page is not used

export class UserTasksPage {

    user: User = new User();
    seg;

    constructor(private navParams: NavParams) {

        this.seg = "active";
        this.user = this.navParams.get('user');

    }
}
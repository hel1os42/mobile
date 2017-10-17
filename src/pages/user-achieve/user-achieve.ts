import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { User } from '../../models/user';

@Component({
    selector: 'page-user-achieve',
    templateUrl: 'user-achieve.html'
})
export class UserAchievePage {

    user: User = new User();

    constructor(private navParams: NavParams) {

        this.user = this.navParams.get('user')
    }

}
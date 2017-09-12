import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';

@Component({
    selector: 'page-user-users',
    templateUrl: 'user-users.html'
})
export class UserUsersPage {
    referrals: User[];
    total: number;

  constructor(
      private nav: NavController,
      private profile: ProfileService) {

  }

  ionViewDidLoad() {
      this.profile.getReferrals()
        .subscribe(resp => {            
            this.referrals = resp.data;
            this.total = resp.total;
      })
  }
}
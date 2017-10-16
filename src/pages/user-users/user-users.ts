import { Component } from '@angular/core';
import { ProfileService } from '../../providers/profile.service';
import { User } from '../../models/user';

@Component({
    selector: 'page-user-users',
    templateUrl: 'user-users.html'
})
export class UserUsersPage {
    referrals: User[];
    total: number;

  constructor(private profile: ProfileService) {

  }

  ionViewDidLoad() {
      this.profile.getReferrals()
        .subscribe(resp => {            
            this.referrals = resp.data;
            this.total = resp.total;
      })
  }
}
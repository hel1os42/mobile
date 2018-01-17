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
    page = 1;
    lastPage: number;

  constructor(private profile: ProfileService) {

  }

  ionViewDidLoad() {
      this.profile.getReferrals(this.page)
        .subscribe(resp => {            
            this.referrals = resp.data;
            this.total = resp.total;
            this.lastPage = resp.last_page;
      })
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    if (this.page <= this.lastPage) {
        setTimeout(() => {
            this.profile.getReferrals(this.page)
                .subscribe(resp => {
                    this.referrals = [...this.referrals, ...resp.data];
                    infiniteScroll.complete();
                });
        });
    }
    else {
        infiniteScroll.complete();
    }
}

}
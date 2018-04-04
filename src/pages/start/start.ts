import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';
import { SocialService } from '../../providers/social.service';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})

export class StartPage {

    socialData;

    constructor(
        private nav: NavController,
        private social: SocialService) {
    }

    login() {
        this.nav.push(LoginPage);
    }

    register() {
        this.nav.push(SignUpPage);
    }

    getTwitterProfile() {
        this.social.twLogin()
            .then(resp => {
                this.social.getTwProfile()
                    .then(res => {
                        //?
                    })
                    .catch(user => {
                        this.socialData = {
                            name: user.name,
                            // name: user.screen_name,
                            // email: user.email,
                            picture: user.profile_image_url_https
                        };
                        this.social.twLogout()
                            .then(() => this.nav.push(SignUpPage, { social: this.socialData }));
                    })
                // .subscribe(user => {
                //     debugger
                //     console.log(user);
                //     this.socialData = {
                //         // name: user.name,
                //         name: user.screen_name,
                //         // email: user.email,
                //         picture: user.profile_image_url_https
                //     };
                //     this.social.twLogout()
                //         .then(() => this.nav.push(SignUpPage, { social: this.socialData }));
                // })

            })
            .catch(err => {
                console.log(err);
            })
    }
}

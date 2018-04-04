import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';
import { SocialService } from '../../providers/social.service';
import { AppAvailability } from '@ionic-native/app-availability';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})

export class StartPage {

    socialData;
    isTwApp = false;
    isSocial = true;

    constructor(
        private nav: NavController,
        private social: SocialService,
        private platform: Platform,
        private appAvailability: AppAvailability) {

        let twApp;

        if (this.platform.is('ios')) {
            twApp = 'twitter://';
        } else if (this.platform.is('android')) {
            twApp = 'com.twitter.android';
        }

        this.appAvailability.check(twApp)
            .then(
                (yes: boolean) => this.isTwApp = true,
                (no: boolean) => this.isTwApp = false
            );

    }

    login() {
        this.nav.push(LoginPage);
    }

    register() {
        this.nav.push(SignUpPage);
    }

    getTwitterProfile() {
        if (this.isSocial) {
            this.isSocial = false;
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
                                .then(() => {
                                    this.nav.push(SignUpPage, { social: this.socialData });
                                    this.isSocial = true;
                                });
                        })
                    // .subscribe(user => {
                    //     this.socialData = {
                    //         name: user.name,
                    //         //name: user.screen_name,
                    //         // email: user.email,
                    //         picture: user.profile_image_url_https
                    //     };
                    //     console.log(user);
                    //     debugger
                    //     this.social.twLogout()
                    //         .then(() => this.nav.push(SignUpPage, { social: this.socialData }));
                    //     this.isSocial = true;
                    // })

                })
                .catch(err => {
                    // console.log(err);
                    this.isSocial = true;
                })
        }
    }
}

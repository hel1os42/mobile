import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';
import { SocialService } from '../../providers/social.service';
import { AppAvailability } from '@ionic-native/app-availability';
import { FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})

export class StartPage {

    socialData;
    isTwApp = false;
    isFbApp = false;
    isSocial = true;

    constructor(
        private nav: NavController,
        private social: SocialService,
        private platform: Platform,
        private appAvailability: AppAvailability) {

        let twApp;
        let fbApp;

        if (this.platform.is('ios')) {
            twApp = 'twitter://';
            fbApp = 'fb://';
        } else if (this.platform.is('android')) {
            twApp = 'com.twitter.android';
            fbApp = 'com.facebook.katana'
        }

        this.appAvailability.check(twApp)
            .then(
                (yes: boolean) => this.isTwApp = true,
                (no: boolean) => this.isTwApp = false
            );
        this.appAvailability.check(fbApp)
            .then(
                (yes: boolean) => this.isFbApp = true,
                (no: boolean) => this.isFbApp = false
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
                    console.log('resp ' + resp)
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
                    console.log("catch: " + err);
                    this.isSocial = true;
                })
        }
    }

    getFbProfile() {
        this.social.fbLogin()
            .then((res: FacebookLoginResponse) => {
                let userId = res.authResponse.userID;
                this.social.getFbProfile(userId)
                    .then(resp => {
                        this.socialData = {
                            name: resp.first_name,
                            // name: user.screen_name,
                            email: resp.email,
                            picture: resp.profile_pic
                        };
                        this.nav.push(SignUpPage, { social: this.socialData });
                        console.log(resp);
                        debugger;
                    })

            })
            .catch(e => console.log('Error logging into Facebook', e));
    }
}

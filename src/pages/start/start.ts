import { Component } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { NavController, Platform } from 'ionic-angular';
import { SocialService } from '../../providers/social.service';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})

export class StartPage {

    socialData;
    isTwApp = false;
    // isFbApp = false;
    isSocial = true;

    constructor(
        private nav: NavController,
        private social: SocialService,
        private platform: Platform,
        private appAvailability: AppAvailability) {

        let twApp;
        // let fbApp;

        if (this.platform.is('ios')) {
            twApp = 'twitter://';
            // fbApp = 'fb://';
        } else if (this.platform.is('android')) {
            twApp = 'com.twitter.android';
            // fbApp = 'com.facebook.katana'
        }

        this.appAvailability.check(twApp)
            .then(
                (yes: boolean) => this.isTwApp = true,
                (no: boolean) => this.isTwApp = false
            );
        // this.appAvailability.check(fbApp)
        //     .then(
        //         (yes: boolean) => this.isFbApp = true,
        //         (no: boolean) => this.isFbApp = false
        //     );
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
        if (this.isSocial) {
            this.isSocial = false;
            this.social.getFbLoginStatus()
                .then((res) => {
                    this.isSocial = true;
                    // let userId: string;
                    let promise: Promise<any>;
                    if (res.status === 'unknown') {
                        promise = this.social.fbLogin();
                    }
                    else if (res.status === 'connected') {
                        promise = Promise.resolve();
                        // userId = res.authResponse.userID;
                    }
                    // console.log(res);
                    promise.then(resp => {
                        // if (resp && resp.authResponse) {
                        //     userId = resp.authResponse.userID;
                        // }
                        // console.log(resp);
                        this.social.getFbProfile()
                            .then(user => {
                                this.socialData = {
                                    name: user.name,
                                    email: user.email,
                                    picture: user.picture_large.data.url
                                };
                                this.nav.push(SignUpPage, { social: this.socialData });
                                this.social.fbLogout();
                                // console.log(user);
                            })
                            .catch(err => {
                                // console.log(err);
                            })
                    })
                })
                .catch(e => {
                    this.isSocial = true;
                    console.log('Error logging into Facebook', e);
                });
        }
    }

    getInstaProfile() {
        this.social.instaLogin()
            .then((resp: any) => {
                this.socialData = {
                    name: resp.user.name,
                    email: resp.user.email,
                    picture: resp.user.picture_large.data.url
                };
            },
                (error) => {
                    console.log(JSON.stringify('Error logging into Instagram'));
                });
    }

    getVkProfile() {
        this.social.vkLogin()
            .then((resp: any) => {
                this.social.getVkProfile(resp.access_token, resp.user_id)
                    .subscribe(profile => {
                        this.socialData = {
                            name: profile.response[0].first_name,
                            email: resp.email,
                            picture: profile.response[0].photo_200
                        }
                        this.nav.push(SignUpPage, { social: this.socialData });
                    },
                        error => console.log('VK get profile error' + error));
            })
            .catch(err => console.log('VK login error' + err));
    }
}

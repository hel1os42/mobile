import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SocialData } from '../../models/socialData';
import { SocialService } from '../../providers/social.service';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';

@Component({
    selector: 'page-start',
    templateUrl: 'start.html'
})

// this page is not used

export class StartPage {

    socialData: SocialData;
    isSocial = true;

    constructor(
        private nav: NavController,
        private social: SocialService) { }

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
                    this.social.getTwProfile(resp)
                        .then(res => {
                            //?
                        })
                        // err => {debugger;})
                        .catch(profile => {
                            this.createSocData(profile.name, profile.profile_image_url_https, profile.id, 'twitter');
                            // socialId: resp.userId
                            // email: user.email,
                            this.social.twLogout();
                            // .then((resp) => {
                            this.nav.push(SignUpPage, { social: this.socialData });
                            this.isSocial = true;
                            // });
                        })
                },
                    error => {
                        this.social.twLogout();
                        this.isSocial = true;
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
                    // let userId: string;
                    let promise: Promise<any>;
                    if (res.status === 'unknown') {
                        promise = this.social.fbLogin();
                    } else if (res.status === 'connected') {
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
                            .then(profile => {
                                this.createSocData(profile.name, profile.picture_large.data.url, profile.id, 'facebook', profile.email, )
                                this.nav.push(SignUpPage, { social: this.socialData });
                                this.social.fbLogout();
                                this.isSocial = true;
                                // console.log(user);
                            })
                            .catch(err => {
                                this.isSocial = true;
                                // console.log(err);
                            })
                    },
                        err => {
                            this.isSocial = true;
                        })
                },
                    error => {
                        this.isSocial = true;
                    })
                .catch(e => {
                    this.isSocial = true;
                    console.log('Error logging into Facebook', e);
                });
        }
    }

    getInstaProfile() {
        if (this.isSocial) {
            this.isSocial = false;
            this.social.instaLogin()
                .then((resp: any) => {
                    this.social.getInstaProfile(resp.access_token)
                        .subscribe(data => {
                            let profile = data.data;
                            this.createSocData(profile.full_name, profile.profile_picture, profile.id, 'instagram');
                            // email: profile.email
                            this.nav.push(SignUpPage, { social: this.socialData });
                            this.isSocial = true;
                        },
                            error => {
                                console.log('Instagram get profile error' + error);
                                this.isSocial = true;
                            });
                },
                    error => {
                        this.isSocial = true;
                    })
                .catch(error => {
                    this.isSocial = true;
                    console.log(JSON.stringify('Error logging into Instagram'));
                });
        }
    }

    getVkProfile() {
        if (this.isSocial) {
            this.isSocial = false;
            this.social.vkLogin()
                .then((resp: any) => {
                    this.social.getVkProfile(resp.access_token, resp.user_id)
                        .subscribe(data => {
                            let profile = data.response[0];
                            this.createSocData(profile.first_name, profile.photo_200, resp.user_id, 'vk', resp.email);
                            this.nav.push(SignUpPage, { social: this.socialData });
                            this.isSocial = true;
                        },
                            error => {
                                console.log('VK get profile error' + error);
                                this.isSocial = true;
                            });
                },
                    error => {
                        this.isSocial = true;
                    })
                .catch(err => {
                    this.isSocial = true;
                    console.log('VK login error' + err);
                });
        }
    }

    createSocData(name: string, picture: string, socialId: string, socialName: string, email?: string) {
        this.socialData = {
            token: '',//mock
            name: name,
            email: email,
            picture: picture,
            socialId: socialId,
            socialName: socialName
        };
    }
}

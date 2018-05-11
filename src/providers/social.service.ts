import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Instagram, VK } from 'ng2-cordova-oauth/core';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
// import { TwitterService } from 'ng2-twitter';

@Injectable()

export class SocialService {

    oauth: OauthCordova = new OauthCordova();

    instagramProvider: Instagram = new Instagram({
        clientId: 'f3e53b167fef46e5a361ab3dd1887d86',
        redirectUri: 'http://localhost',  // Let is be localhost for Mobile Apps
        responseType: 'token',
        appScope: ['basic', 'public_content']
    });
    vkProvider: VK = new VK({
        clientId: '6473105',
        redirectUri: 'http://localhost',
        appScope: ['basic', 'public_content', 'email'],
    })
    // twitterProvider: Twitter = new Twitter({
    //     // clientId: '1t57CCFvafiX2oaEJuREbE0sz',
    //     consumerKey: '1t57CCFvafiX2oaEJuREbE0sz',
    //     consumerSecret: 'O5pryneH5CALpAcZBbiCrmie62VjvPwmJy0EZQYkRFKbcTbBPa',
    //     redirectUri: 'http://localhost',
    //     // responseType: 'token',
    //     // appScope: ['basic', 'public_content'],
    //     // token: '	909746010884370432-7eWkN323lWr6eZQ8UbYLOkHednWoFTY',
    //     // tokenSecret: 'lKqCslBNEPHYBecgsruwr7eIZxIUdqv2ZDdhSZ9YWjRkv'
    // })
    fbPath = 'me?fields=name,email,picture.width(720).height(720).as(picture_large)';
    instaUrl = 'https://api.instagram.com/v1/users/self/?access_token=';
    twitterUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true';

    constructor(
        private twitter: TwitterConnect,
        // private twitterService: TwitterService,
        private fb: Facebook,
        private http: Http) {
    }

    twLogin() {
        return this.twitter.login();
        // return this.oauth.logInVia(this.twitterProvider);
    }

    getTwProfile(response) {
        // return this.twitterService.get(
        //     'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        //     {
        //         count: 1
        //     },
        //     {
        //         consumerKey: '1t57CCFvafiX2oaEJuREbE0sz',
        //         consumerSecret: 'O5pryneH5CALpAcZBbiCrmie62VjvPwmJy0EZQYkRFKbcTbBPa'
        //     },
        //     {
        //         token: response.token,
        //         tokenSecret: response.secret
        //     }
        // )
        //     .map(res => res.json());
        return this.twitter.showUser();
    }

    twLogout() {
        return this.twitter.logout();
    }

    getFbLoginStatus() {
        return this.fb.getLoginStatus();
    }

    fbLogin() {
        return this.fb.login(['public_profile', 'email']);
    }

    fbLogout() {
        return this.fb.logout();
    }

    getFbProfile() {
        return this.fb.api(this.fbPath, ['public_profile', 'email']);
    }

    instaLogin() {
        return this.oauth.logInVia(this.instagramProvider);
    }

    getInstaProfile(token) {
        return this.http.get(this.instaUrl + token)
            .map((res: Response) => res.json());
    }

    vkLogin() {
        return this.oauth.logInVia(this.vkProvider);
    }

    getVkProfile(token, user_id) {
        let url = `https://api.vk.com/method/users.get?&v=5.74&user_id=${user_id}&access_token=${token}&fields=photo_200`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }
  
}
import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Instagram, VK } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class SocialService {

    token;
    secret;
    oauth: OauthCordova = new OauthCordova();
    instagramProvider: Instagram = new Instagram({
        clientId: 'f3e53b167fef46e5a361ab3dd1887d86',
        redirectUri: 'http://localhost/',  // Let is be localhost for Mobile Apps
        responseType: 'token',
        appScope: ['basic', 'public_content']
    });
    vkProvider: VK = new VK({
        clientId: '6473105',
        redirectUri: 'http://localhost/',
        appScope: ['basic', 'public_content', 'email'],
    })
    fbPath = 'me?fields=name,email,picture.width(720).height(720).as(picture_large)';
    instaUrl = 'https://api.instagram.com/v1/users/self/?access_token=';

    constructor(
        private twitter: TwitterConnect,
        // private twitter: TwitterService,
        private fb: Facebook,
        private http: Http) {
    }

    // setTokens(token, secret) {
    //     this.token = token;
    //     this.secret = secret;
    // }

    twLogin() {
        let promise = this.twitter.login();
        // promise.then(resp => this.setTokens(resp.token, resp.secret));
        return promise;
    }

    getTwProfile() {
        return this.twitter.showUser();
        // return this.twitterService.get(
        //     'https://api.twitter.com/1.1/account/verify_credentials.json',
        //     {
        //         count: 1
        //     },
        //     {
        //         consumerKey: '1t57CCFvafiX2oaEJuREbE0sz',
        //         consumerSecret: 'O5pryneH5CALpAcZBbiCrmie62VjvPwmJy0EZQYkRFKbcTbBPa'
        //     },
        //     {
        //         token: '909746010884370432-7eWkN323lWr6eZQ8UbYLOkHednWoFTY',
        //         tokenSecret: 'lKqCslBNEPHYBecgsruwr7eIZxIUdqv2ZDdhSZ9YWjRkv'
        //         // token: this.token,
        //         // tokenSecret: this.secret
        //     }
        // )
        //     .map(res => res.json());
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

    // getInstaProfile(response) {
    //     return this.http.get(this.instaUrl + response.access_token)
    //         .map((res: Response) => res.json());
    // }

    vkLogin() {
        return this.oauth.logInVia(this.vkProvider);
    }

    getVkProfile(token, user_id) {
        let url = `https://api.vk.com/method/users.get?&v=5.74&user_id=${user_id}&access_token=${token}&fields=photo_200`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }
  
}
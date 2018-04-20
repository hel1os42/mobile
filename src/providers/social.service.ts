import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SocialService {

    token;
    secret;
    oauth: OauthCordova = new OauthCordova();
    instagramProvider: Instagram = new Instagram({
        clientId: '585f9305ab1946a6b7ca1ef576b5246c',
        redirectUri: 'http://ionic.local/*',  // Let is be localhost for Mobile Apps
        responseType: 'token',  
        appScope: ['basic', 'public_content']
    });
    fbPath = 'me?fields=name,email,picture.width(720).height(720).as(picture_large)';
    instaUrl = 'https://api.instagram.com/v1/users/self/?access_token=';

    constructor(
        private twitter: TwitterConnect,
        // private twitter: TwitterService,
        private fb: Facebook,
        public http: Http) {

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
    //     return this.http.get(this.instaUrl + response.access_token + '&count=5')
    //         .map((res: Response) => res.json());
    // }
}
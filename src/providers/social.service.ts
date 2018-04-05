import { Injectable } from "@angular/core";
import { TwitterConnect } from "@ionic-native/twitter-connect";
import { ToastService } from "./toast.service";
import { Observable } from "rxjs";
import { Facebook } from "@ionic-native/facebook";

@Injectable()
export class SocialService {

    token;
    secret;

    constructor(
        private twitter: TwitterConnect,
          // private twitter: TwitterService,
        private toast: ToastService,
        private fb: Facebook) {

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

    fbLogin() {
        return this.fb.login(['public_profile', 'email']);
    }

    getFbProfile(userId) {
        return this.fb.api(`Profile /${userId}`, ['public_profile', 'email'])
    }
}
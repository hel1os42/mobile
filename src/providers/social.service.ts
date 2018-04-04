import { Injectable } from "@angular/core";
import { TwitterConnect } from "@ionic-native/twitter-connect";
import { ToastService } from "./toast.service";
import { Observable } from "rxjs";

@Injectable()
export class SocialService {

    token;
    secret;

    constructor(
        private twitter: TwitterConnect,
        // private twitter: TwitterService,
        private toast: ToastService) {

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
        // return this.twitter.get(
        //     'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        //     {
        //         count: 1
        //     },
        //     {
        //         consumerKey: 'bW9h6Yb4ZDwXcWTy3yfiEB6Ra',
        //         consumerSecret: 'fspg3Nfpa1Ydtn6wbAcamTNiNKd22ywSAYbpPqKQx0MHWZ0wq8'
        //     },
        //     {
        //         // token: '909746010884370432-LT1iPQ2vHu6KAXutOK1xlCkukKdqDp9',
        //         // tokenSecret: 'h41QtP8Gt83OZcKVXuqdCOjgH3NdMwNn3qh3xataW49UM'
        //         token: this.token,
        //         tokenSecret: this.secret
        //     }
        // )
        //     .map(res => res.json());
    }

    twLogout() {
        return this.twitter.logout();
    }
}
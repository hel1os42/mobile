import { Component, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController, Content, Navbar, NavController, Platform, Select, LoadingController } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { LocationService } from '../../providers/location.service';
import { StringValidator } from '../../validators/string.validator';
import { SignUpPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { SocialData } from '../../models/socialData';
import { SocialService } from '../../providers/social.service';
import { SocialIdentity } from '../../models/socialIdentity';
import { StorageService } from '../../providers/storage.service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    authData: Login = {
        phone: '',
        code: ''
    };
    //numCodes = ['+7', '+49', '+63', '+57', '+380', '+86'];
    page;
    clickMode = 0;
    envName: string;
    isVisibleLoginButton = false;
    phoneCodes = PHONE_CODES;
    numCode = PHONE_CODES.find(item => item.code === 'US');
    onKeyboardShowSubscription: Subscription;
    onKeyboardHideSubscription: Subscription;
    backAction;
    countDown;
    counter = 60;
    tick = 1000;
    timer;
    isRetry = false;
    socialData: SocialData;
    isSocial = true;
    HTTP_STATUS_CODE_PAGE_NOT_FOUND = 404;
    isLogin = false;

    @ViewChild('codeSelect') codeSelect: Select;
    @ViewChild(Content) content: Content;
    @ViewChild('navbar') navBar: Navbar;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private alert: AlertController,
        private location: LocationService,
        private keyboard: Keyboard,
        private analytics: GoogleAnalytics,
        private social: SocialService,
        private storage: StorageService,
        private loading: LoadingController) {

        if (this.platform.is('android')) {
            let
                appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
                appElHeight = appEl.clientHeight;
            this.onKeyboardShowSubscription = this.keyboard.onKeyboardShow()
                .subscribe(() => {
                    // console.log('login open')
                    appEl.style.height = (appElHeight - (appElHeight / 3)) + 'px';
                    this.content.scrollToBottom();
                })

            this.onKeyboardHideSubscription = this.keyboard.onKeyboardHide()
                .subscribe(() => {
                    // console.log('login hide')
                    appEl.style.height = (appElHeight) + 'px';
                })
        }
        this.envName = this.appMode.getEnvironmentMode();
        this.numCode = this.getNumCode();
    }

    // ionViewDidEnter() {
    //     this.navBar.backButtonClick = (ev: UIEvent) => {
    //         if (this.isVisibleLoginButton) {
    //             this.isVisibleLoginButton = false;
    //             this.backAction();
    //         }
    //         else this.nav.pop();
    //     }
    // }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getDevMode() {
        return (this.envName === 'dev' || this.envName === 'test');
    }

    getNumCode() {
        if (this.getDevMode()) {
            this.numCode = this.phoneCodes.find(item => item.dial_code === '+380');
            return this.numCode;
        }
        else {
            this.location.getByIp()
                .subscribe(resp => {
                    this.numCode = this.phoneCodes.find(item => item.code === resp.country_code);
                    return this.numCode;
                },
                    err => {
                        this.numCode = this.phoneCodes.find(item => item.code === 'US');
                        return this.numCode;
                    })

        }
    }

    getOtp() {
        let loading = this.loading.create();
        loading.present();
        let phone = this.numCode.dial_code + this.authData.phone
        this.auth.getOtp(phone)
            .subscribe(() => {
                this.isLogin = true;
                this.otpHandler();
                loading.dismiss();
                debugger
            },
                err => {
                    let inviteCode = this.storage.get('invCode');
                    if (err.respStatus == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && !inviteCode) {
                        this.nav.push(SignUpPage, { phone: this.authData.phone, numCode: this.numCode });
                        debugger
                    }
                    else if (err.respStatus == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && inviteCode) {
                        this.auth.getReferrerId(inviteCode, phone)
                            .subscribe(() => {
                                this.otpHandler();
                                debugger
                            })
                    };
                    loading.dismiss();
                }
            );
    }

    otpHandler() {
        this.isVisibleLoginButton = true;
        this.cancelTimer();
        this.isRetry = false;
        if (this.getDevMode()) {
            this.authData.code = this.authData.phone.slice(-4);
        }
        this.backAction = this.platform.registerBackButtonAction(() => {
            if (this.isVisibleLoginButton) {
                this.isVisibleLoginButton = false;
                this.backAction();
            }
        }, 1);
        this.countDown = Observable.timer(0, this.tick)
            .take(this.counter)
            .map(() => --this.counter);
        this.timer = setInterval(() => {
            if (this.counter < 1) {
                this.cancelTimer();
                this.isRetry = true;
            }
        }, 1000);
    }

    login() {
        this.auth.login({
            phone: this.numCode.dial_code + this.authData.phone,
            code: this.authData.code
        })
            .subscribe(resp => {
                // this.analytics.trackEvent("Session", 'event_phoneconfirm');
                // this.profile.get(true, false);//for sending one signal tags
                //     .subscribe(res => {
                //         this.location.refreshDefaultCoords({ lat: res.latitude, lng: res.longitude }, true);
                //         if (res.name == '' && !res.email) {
                //             this.nav.setRoot(CreateUserProfilePage)
                //         }
                //         else {
                this.nav.setRoot(TabsPage, { index: 0 });
                //     }
                // })
            });
    }

    cancelTimer() {
        this.stopTimer();
        this.countDown = undefined;
        this.counter = 60;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    // signup() {
    //     this.nav.push(SignUpPage);
    // }

    limitStr(str: string, length: number) {
        if (length == 14) this.authData.phone = StringValidator.stringLimitMax(str, length);
        else this.authData.code = StringValidator.stringLimitMax(str, length);
    }

    presentPrompt(selected: boolean) {
        let prompt = this.alert.create({
            title: 'Choose environment',
            message: '',
            inputs: [
                {
                    type: 'radio',
                    label: 'develop',
                    value: 'dev',
                    checked: this.envName == 'dev'
                },
                {
                    type: 'radio',
                    label: 'test',
                    value: 'test',
                    checked: this.envName == 'test'
                },
                {
                    type: 'radio',
                    label: 'production',
                    value: 'prod',
                    checked: this.envName == 'prod'
                },
                // {
                //     type: 'radio',
                //     label: 'fork',
                //     value: 'fork',
                //     // checked: this.envName == 'prod'
                // }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.clickMode = 0;
                        return;
                    }
                },
                {
                    text: 'Ok',
                    handler: (data) => {
                        if (!data || this.envName == data) {
                            return;
                        }
                        // else {
                        //     if (data === 'fork') {
                        //         this.envName = 'prod';
                        //         this.appMode.setForkMode();// only for fork mode;
                        //         this.appMode.setEnvironmentMode('prod');
                        //         debugger
                        //     }
                        else {
                            this.envName = data;
                            this.appMode.setEnvironmentMode(data);
                            this.getNumCode();
                        }
                        // }
                    }
                }
            ]
        });
        prompt.present();
        this.clickMode = 0;
    }

    toggleMode() {
        this.clickMode = this.clickMode + 1;
        if (this.clickMode >= 5) {
            this.presentPrompt(false);
        }
    }

    onSelectClicked(selectButton: Select) {
        (<any>selectButton._overlay).didEnter.subscribe(
            () => {
                setTimeout(() => {
                    const options = document.getElementsByClassName('alert-tappable alert-radio');
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].attributes[3].nodeValue === 'true') {
                            options[i].scrollIntoView({ block: 'center', behavior: 'instant' })
                        }
                    }
                }, 5);
            }
        );
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
                    // .subscribe(user => {
                    //     debugger
                    //     this.socialData = {
                    //         name: user.name,
                    //         //name: user.screen_name,
                    //         // email: user.email,
                    //         picture: user.profile_image_url_https
                    //     };
                    //     console.log(user);
                    //     this.nav.push(SignUpPage, { social: this.socialData });
                    //     this.isSocial = true;
                    // },
                    //     err => {
                    //         this.isSocial = true;
                    //         debugger
                    //     })
                },
                    error => {
                        this.social.twLogout();
                        this.isSocial = true;
                    })
                .catch(err => {
                    // console.log("catch: " + err);
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
                    let accessToken: string;
                    let promise: Promise<any>;
                    if (res.status === 'unknown') {
                        promise = this.social.fbLogin();
                    }
                    else if (res.status === 'connected') {
                        promise = Promise.resolve();
                        if (res.authResponse) {
                            accessToken = res.authResponse.accessToken;
                        }
                        // userId = res.authResponse.userID;
                    }
                    // console.log(res);
                    promise.then(resp => {
                        if (resp && resp.authResponse) {
                            accessToken = resp.authResponse.accessToken;
                        }
                        // console.log(resp);
                        let identity: SocialIdentity = {
                            identity_access_token: accessToken,
                            identity_provider: 'facebook'
                        }
                        this.auth.loginViaSocial(identity)
                            .subscribe(() => this.nav.setRoot(TabsPage, { index: 0 }),
                                err => {

                                });
                        this.social.getFbProfile()
                            .then(profile => {
                                this.createSocData(profile.name, profile.picture_large.data.url, profile.id, 'facebook', profile.email, )
                                this.nav.push(SignUpPage, { social: this.socialData });
                                // this.social.fbLogout();
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
                    // console.log('Error logging into Facebook', e);
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
                                // console.log('Instagram get profile error' + error);
                                this.isSocial = true;
                            });
                },
                    error => {
                        this.isSocial = true;
                    })
                .catch(error => {
                    this.isSocial = true;
                    // console.log(JSON.stringify('Error logging into Instagram'));
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
                                // console.log('VK get profile error' + error);
                                this.isSocial = true;
                            });
                },
                    error => {
                        this.isSocial = true;
                    })
                .catch(err => {
                    this.isSocial = true;
                    // console.log('VK login error' + err);
                });
        }
    }

    createSocData(name: string, picture: string, socialId: string, socialName: string, email?: string) {
        this.socialData = {
            name: name,
            email: email,
            picture: picture,
            socialId: socialId,
            socialName: socialName
        };
    }

    ngOnDestroy() {
        if (this.platform.is('android')) {
            this.onKeyboardShowSubscription.unsubscribe();
            this.onKeyboardHideSubscription.unsubscribe();
        }
        if (this.backAction) {
            this.backAction();
        }
    }
}

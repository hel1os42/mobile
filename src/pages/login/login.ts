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
import { Register } from '../../models/register';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ProfileService } from '../../providers/profile.service';
import { ApiService } from '../../providers/api.service';
import { File } from '@ionic-native/file';

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
    register: Register;
    FACEBOOK = 'facebook';
    TWITTER = 'twitter';
    INSTAGRAM = 'instagram';
    VK = 'vk';

    @ViewChild('codeSelect') codeSelect: Select;
    @ViewChild(Content) content: Content;
    @ViewChild('navbar') navBar: Navbar;
    @ViewChild('inputPhone') inputPhone;

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
        private loading: LoadingController,
        private profile: ProfileService,
        private fileTransfer: FileTransfer,
        private file: File,
        private api: ApiService) {

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
            },
                err => {
                    let inviteCode = this.storage.get('invCode');
                    if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && !inviteCode) {
                        this.nav.push(SignUpPage, { phone: this.authData.phone, numCode: this.numCode, social: this.socialData });
                    }
                    else if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && inviteCode) {
                        this.auth.getReferrerId(inviteCode, phone)
                            .subscribe((resp) => {
                                this.register = {
                                    phone: resp.phone,
                                    code: '',
                                    referrer_id: resp.referrer_id,
                                };
                                this.otpHandler();
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
        let phone = this.numCode.dial_code + this.authData.phone;
        let obs;
        if (this.isLogin && !this.socialData) {
            obs = this.auth.login({ phone: phone, code: this.authData.code });
        }
        else {
            if (this.socialData) {
                this.register.identity_access_token = this.socialData.token;
                this.register.identity_provider = this.socialData.socialName;
            }
            this.register.code = this.authData.code;
            obs = this.auth.register(this.register)
        }
        obs.subscribe(resp => {
            if (this.socialData) {
                this.setProfile();
            }
            this.nav.setRoot(TabsPage, { index: 0 });
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
                    let identity: SocialIdentity = {
                        identity_access_token: resp.token,
                        identity_provider: this.TWITTER
                        //to do - will get resp.secret
                    }
                    this.social.getTwProfile(resp)
                        .then(res => {
                            //?
                            // this.createSocData(resp.token, res.name, res.profile_image_url_https, res.id, this.TWITTER);
                            // this.loginViaSocial(identity);
                            // this.isSocial = true;
                        })
                        .catch(profile => {
                            this.createSocData(resp.token, profile.name, profile.profile_image_url_https, profile.id, this.TWITTER);
                            this.loginViaSocial(identity);
                            // this.social.twLogout();
                            this.isSocial = true;
                        })
                },
                    error => {
                        // this.social.twLogout();
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
                            identity_provider: this.FACEBOOK
                        }
                        this.social.getFbProfile()//for profile update
                            .then(profile => {
                                this.createSocData(accessToken, profile.name, profile.picture_large.data.url, profile.id, this.FACEBOOK, profile.email);
                                // this.social.fbLogout();
                                this.isSocial = true;
                                // console.log(user)
                                this.loginViaSocial(identity);
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
                            this.createSocData(resp.access_token, profile.full_name, profile.profile_picture, profile.id, this.INSTAGRAM);
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
                    let identity: SocialIdentity = {
                        identity_access_token: resp.access_token,
                        identity_provider: this.VK
                    }
                    this.social.getVkProfile(resp.access_token, resp.user_id)
                        .subscribe(data => {
                            let profile = data.response[0];
                            this.createSocData(resp.access_token, profile.first_name, profile.photo_200, resp.user_id, this.VK, resp.email);
                            this.loginViaSocial(identity);
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

    loginViaSocial(identity: SocialIdentity) {
        this.auth.loginViaSocial(identity)
            .subscribe((resp) => {
                this.nav.setRoot(TabsPage, { index: 0 });
                this.setProfile();
            },
                err => {
                    setTimeout(() => {
                        this.keyboard.show();
                        this.inputPhone.setFocus();
                    }, 500)
                });
    }

    setProfile() {
        let profile = {//add email
            name: this.socialData.name,
            email: this.socialData.email
        }
        this.profile.patch(profile, false);
        if (this.socialData.picture && this.socialData.picture !== '') {
            let transfer = this.fileTransfer.create();
            let uri = encodeURI(this.socialData.picture);
            transfer.download(uri, this.file.dataDirectory + 'profileAva.jpg')
                .then(entry => {
                    this.api.uploadImage(entry.toURL(), 'profile/picture', false);
                })
        }
    }

    createSocData(token: string, name: string, picture: string, socialId: string, socialName: string, email?: string) {
        this.socialData = {
            token: token,
            name: name,
            email: email,
            picture: picture,
            socialId: socialId,
            socialName: socialName
        };
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

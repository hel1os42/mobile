import { Component, ViewChild } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { AlertController, Content, LoadingController, Navbar, NavController, Platform, Select } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { PHONE_CODES } from '../../const/phoneCodes.const';
import { Login } from '../../models/login';
import { Register } from '../../models/register';
import { SocialData } from '../../models/socialData';
import { SocialIdentity } from '../../models/socialIdentity';
import { ApiService } from '../../providers/api.service';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { LocationService } from '../../providers/location.service';
import { ProfileService } from '../../providers/profile.service';
import { SocialService } from '../../providers/social.service';
import { StorageService } from '../../providers/storage.service';
import { StringValidator } from '../../validators/string.validator';
import { TabsPage } from '../tabs/tabs';
import { AppAvailability } from '@ionic-native/app-availability';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    authData: Login = {
        phone: '',
        code: '',
        inviteCode: ''
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
    BAD_USER_REFERRER_LINK = 400;
    isLogin = false;
    register = new Register();
    FACEBOOK = 'facebook';
    TWITTER = 'twitter';
    INSTAGRAM = 'instagram';
    VK = 'vk';
    termsUrl = 'https://nau.io/terms';
    policyUrl = 'https://nau.io/privacy-policy';
    testAdjustLabel: string;//temporary
    isRegisterMode: boolean;
    isInviteVisible = false;
    defaultInvite: string;
    isTwitterAvailability: boolean;

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
        private social: SocialService,
        private storage: StorageService,
        private loading: LoadingController,
        private profile: ProfileService,
        private fileTransfer: FileTransfer,
        private file: File,
        private api: ApiService,
        private browser: InAppBrowser,
        private appAvailability: AppAvailability,
        private statusBar: StatusBar,
        private translate: TranslateService) {

        this.isRegisterMode = !this.appMode.getRegisteredMode();
        this.envName = this.appMode.getEnvironmentMode();

        this.getInvite();

        if (this.platform.is('cordova')) {
            let app;

            if (this.platform.is('ios')) {
                app = 'twitter://';
            } else if (this.platform.is('android')) {
                app = 'com.twitter.android';
            }

            this.appAvailability.check(app)
                .then(
                    (yes) => {
                        this.isTwitterAvailability = true;
                    },
                    (no) => {
                        this.isTwitterAvailability = false;
                    }
                );
        }

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

        this.numCode = this.getNumCode();
        //temporary for adjust test
        if (this.envName === 'dev') {
            this.testAdjustLabel = this.storage.get('invCode') ? this.storage.get('invCode') : 'adjustError';
        }
        //
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
    ionViewDidLoad() {
        this.statusBar.styleDefault();
    }

    getInvite() {
        const prodInvite = 'nau';
        const testInvite = '5a4';
        const devInvite = '5a4';
        
        this.defaultInvite = this.envName === 'prod' ? prodInvite
            : this.envName === 'test' ? testInvite : devInvite;

        this.authData.inviteCode = this.storage.get('invCode')
            ? this.storage.get('invCode')
            : this.defaultInvite;
    }

    isInviteStorage() {
        return !!this.storage.get('invCode');
    }

    showInvite() {
        this.isInviteVisible = true;
        this.isRegisterMode = false;
    }

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
        } else {
            this.location.getByIp()
                .subscribe(resp => {
                    // this.numCode = this.phoneCodes.find(item => item.code === resp.country_code);
                    this.numCode = this.phoneCodes.find(item => item.code === resp.countryCode);
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

                if (this.socialData) {
                    this.getReferrerId(this.defaultInvite);
                } else {
                    this.otpHandler();
                }
                
                loading.dismiss();
            },
                err => {
                    let formInvite = this.authData.inviteCode;
                    let inviteCode = formInvite && formInvite !== ''
                        ? formInvite
                        : this.defaultInvite;

                    // if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && !inviteCode) {
                    //     this.nav.push(SignUpPage, { phone: this.authData.phone, numCode: this.numCode, social: this.socialData });
                    // }
                    // else if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND && inviteCode) {
                    //     this.getReferrerId(inviteCode, phone);
                    // };
                    if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND) {
                        this.getReferrerId(inviteCode, phone);
                        this.isLogin = false;
                    };
                    loading.dismiss();
                }
            );
    }

    getReferrerId(inviteCode: string, phone?: string) {
        this.auth.getReferrerId(inviteCode, phone)
            .subscribe((resp) => {
                let registerPhone = phone
                    ? resp.phone
                    : this.numCode.dial_code + this.authData.phone;
                this.register = {
                    phone: registerPhone,
                    code: '',
                    referrer_id: resp.referrer_id,
                };
                this.otpHandler();
            },
                err => {
                    if (err.status === this.BAD_USER_REFERRER_LINK && !this.isLogin) {

                        if (this.isInviteStorage()) {
                            this.getReferrerId(this.defaultInvite, phone);//retry get referrer id with default invite code
                        } else {
                            this.presentConfirm(phone);
                        }

                    }
                })
    }

    otpHandler() {
        this.isVisibleLoginButton = true;
        this.isInviteVisible = false;
        this.cancelTimer();
        this.isRetry = false;
        if (this.getDevMode()) {
            this.authData.code = this.authData.phone.slice(-4);
        }
        this.backAction = this.platform.registerBackButtonAction(() => {
            if (this.isVisibleLoginButton) {
                this.isVisibleLoginButton = false;
                this.isRegisterMode = !this.appMode.getRegisteredMode();
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
        } else {
            this.register.code = this.authData.code;
            if (this.socialData) {
                this.register.identity_access_token = this.socialData.token;
                this.register.identity_provider = this.socialData.socialName;
            }
            obs = this.auth.register(this.register);
        }
        obs.subscribe(resp => {
            if (this.socialData) {
                this.setProfile();
            }
            this.nav.setRoot(TabsPage, { index: 0 });
        });
                // },
        //     err => { });
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
                    let token = resp.token + ':' + resp.secret;
                    let identity: SocialIdentity = {
                        identity_access_token: token,
                        identity_provider: this.TWITTER
                    };
                    this.social.getTwProfile(resp)
                        .then(res => {
                            //?
                            // this.createSocData(resp.token, res.name, res.profile_image_url_https, res.id, this.TWITTER);
                            // this.loginViaSocial(identity);
                            // this.isSocial = true;
                        })
                        .catch(profile => {
                            this.createSocData(token, profile.name, profile.profile_image_url_https, profile.id, this.TWITTER);
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
                    } else if (res.status === 'connected') {
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
                        };
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
                    let identity: SocialIdentity = {
                        identity_access_token: resp.access_token,
                        identity_provider: this.INSTAGRAM
                    };
                    this.social.getInstaProfile(resp.access_token)
                        .subscribe(data => {
                            let profile = data.data;
                            this.createSocData(resp.access_token, profile.full_name, profile.profile_picture, profile.id, this.INSTAGRAM);
                            // email: profile.email
                            this.loginViaSocial(identity);
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
                    };
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
                    if (err.status == this.HTTP_STATUS_CODE_PAGE_NOT_FOUND) {
                        setTimeout(() => {
                            this.keyboard.show();
                            if (this.inputPhone) {
                                this.inputPhone.setFocus();
                            }
                        }, 800)
                    }
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

    loadUrl(url) {
        this.browser.create(url, '_system');
    }


    presentConfirm(phone) {
        this.translate.get('PAGE_LOGIN')
            .subscribe(translate => {
                const alert = this.alert.create({
                    title: translate['ERROR_TITLE'],
                    message: translate['ERROR_BODY'],
                    buttons: [{
                        text: translate['ERROR_BTN_RETRY'],
                        role: 'cancel',
                        handler: () => { }
                    }, {
                        text: translate['ERROR_BTN_DEFAULT_INVITE'],
                        handler: () => {
                            this.getReferrerId(this.defaultInvite, phone); //retry get referrer id with default invite code
                        }
                    }]
                });
                alert.present();
            });
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
                        } else {
                            this.envName = data;
                            this.appMode.setEnvironmentMode(data);
                            this.getNumCode();
                            this.getInvite();
                            //temporary for test adjust deeplink
                            if (this.envName === 'dev') {
                                this.testAdjustLabel = this.storage.get('invCode') ? this.storage.get('invCode') : 'adjustError';
                            }
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

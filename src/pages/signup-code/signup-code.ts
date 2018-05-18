import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Register } from '../../models/register';
import { SocialData } from '../../models/socialData';
import { ApiService } from '../../providers/api.service';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { StringValidator } from '../../validators/string.validator';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-signup-code',
    templateUrl: 'signup-code.html'
})
export class SignUpCodePage {
    register: Register;
    envName: string;
    countDown;
    counter = 60;
    tick = 1000;
    timer;
    isRetry = false;
    inviteCode: string;
    socialData: SocialData;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private navParams: NavParams,
        private profile: ProfileService,
        private api: ApiService,
        private fileTransfer: FileTransfer,
        private file: File) {

        this.socialData = this.navParams.get('social');
        this.register = this.navParams.get('register');
        this.inviteCode = this.navParams.get('inviteCode');
        this.envName = this.appMode.getEnvironmentMode();
        if (this.envName === 'dev' || this.envName === 'test') {
            this.register.code = this.register.phone.slice(-4);
        }

    }

    ionViewDidLoad() {
        this.countTime()
    }

    countTime() {
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

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    signUp() {
        this.auth.register(this.register)
            .subscribe(resp => {
                this.auth
                    .login({
                        phone: this.register.phone,
                        code: this.register.code
                    }, false)
                    .subscribe(res => {
                        // this.analytics.trackEvent("Session", 'event_phoneconfirm');
                        this.cancelTimer();
                        this.isRetry = false;
                        if (this.socialData) {
                            this.setProfile();
                        }
                        this.nav.setRoot(TabsPage, { index: 0 });
                        // this.nav.setRoot(CreateUserProfilePage);
                    })
            })
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

    getOtp() {
        this.auth.getReferrerId(this.inviteCode, this.register.phone)
            .subscribe(resp => {
                this.cancelTimer();
                this.isRetry = false;
                this.countTime();
            })
    }

    limitStr(str: string) {
        this.register.code = StringValidator.stringLimitMax(str, 6);
    }

}

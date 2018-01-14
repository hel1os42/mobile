import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { Login } from '../../models/login';
import { AppModeService } from '../../providers/appMode.service';
import { AuthService } from '../../providers/auth.service';
import { StringValidator } from '../../validators/string.validator';
import { SignUpInvitePage } from '../invite/invite';
import { TemporaryPage } from '../temporary/temporary';

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
    numCodes = [
        '+86',
        '+244',
        '+93',
        '+355',
        '+213',
        '+376',
        '+1264',
        '+1268',
        '+54',
        '+374',
        '+247',
        '+61',
        '+43',
        '+994',
        '+1242',
        '+973',
        '+880',
        '+1246',
        '+375',
        '+32',
        '+501',
        '+229',
        '+1441',
        '+591',
        '+267',
        '+55',
        '+673',
        '+359',
        '+226',
        '+95',
        '+257',
        '+237',
        '+1',
        '+1345',
        '+236',
        '+235',
        '+56',
        '+57',
        '+242',
        '+682',
        '+506',
        '+385',
        '+53',
        '+357',
        '+420',
        '+45',
        '+253',
        '+1890',
        '+593',
        '+20',
        '+503',
        '+240',
        '+372',
        '+251',
        '+679',
        '+358',
        '+33',
        '+594',
        '+241',
        '+220',
        '+995',
        '+49',
        '+233',
        '+350',
        '+30',
        '+1809',
        '+1671',
        '+502',
        '+224',
        '+592',
        '+509',
        '+504',
        '+852',
        '+36',
        '+354',
        '+91',
        '+62',
        '+98',
        '+964',
        '+353',
        '+972',
        '+39',
        '+225',
        '+1876',
        '+81',
        '+962',
        '+855',
        '+327',
        '+254',
        '+82',
        '+965',
        '+996',
        '+856',
        '+371',
        '+961',
        '+266',
        '+231',
        '+218',
        '+423',
        '+370',
        '+352',
        '+853',
        '+389',
        '+261',
        '+265',
        '+60',
        '+960',
        '+223',
        '+356',
        '+1670',
        '+596',
        '+230',
        '+52',
        '+373',
        '+377',
        '+976',
        '+382',
        '+1664',
        '+212',
        '+258',
        '+264',
        '+674',
        '+977',
        '+599',
        '+31',
        '+64',
        '+505',
        '+227',
        '+234',
        '+850',
        '+47',
        '+968',
        '+92',
        '+507',
        '+675',
        '+595',
        '+51',
        '+63',
        '+48',
        '+689',
        '+351',
        '+1787',
        '+974',
        '+262',
        '+40',
        '+250',
        '+7',
        '+1758',
        '+1784',
        '+684',
        '+685',
        '+378',
        '+239',
        '+966',
        '+221',
        '+248',
        '+232',
        '+65',
        '+421',
        '+386',
        '+677',
        '+252',
        '+27',
        '+34',
        '+94',
        '+1758',
        '+1784',
        '+249',
        '+597',
        '+268',
        '+46',
        '+41',
        '+963',
        '+886',
        '+992',
        '+255',
        '+66',
        '+228',
        '+676',
        '+1809',
        '+216',
        '+90',
        '+993',
        '+256',
        '+380',
        '+971',
        '+44',
        '+1',
        '+598',
        '+998',
        '+58',
        '+84',
        '+967',
        '+381',
        '+263',
        '+243',
        '+260'
    ];
    numCode: string = '+380';
    page;
    clickMode = 0;
    envMode: string;
    isVisibleLoginButton = false;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService,
        private alert: AlertController) {

        this.envMode = this.appMode.getEnvironmentMode();

    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getDevMode() {
        return this.appMode.getEnvironmentMode() === 'dev';
    }

    getOtp() {
        if (this.getDevMode()) {
            this.isVisibleLoginButton = true;
            this.authData.code = this.authData.phone.slice(-6);
        }
        else {
            this.auth.getOtp(this.numCode + this.authData.phone)
                .subscribe(() => {
                    this.isVisibleLoginButton = true;
                });
        }

    }

    login() {
        this.auth.login({
            phone: this.numCode + this.authData.phone,
            code: this.authData.code
        })
            .subscribe(
            resp => {
                this.appMode.setHomeMode(true);
                // this.profile.get(true)
                //     .subscribe(res => {
                //         if (res.name == '' && !res.email) {
                //             this.nav.setRoot(CreateUserProfilePage)
                //         }
                //         else {
                //             this.nav.setRoot(TabsPage, { index: 0 });
                //         }
                //     });temporary

                this.nav.setRoot(TemporaryPage);//temporary(to remove)

            });
    }

    signup() {
        this.nav.push(SignUpInvitePage);
    }

    limitStr(str: string, length: number) {
        if (length == 12) this.authData.phone = StringValidator.stringLimitMax(str, length);
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
                    checked: this.envMode == 'dev'
                },
                {
                    type: 'radio',
                    label: 'test',
                    value: 'test',
                    checked: this.envMode == 'test'
                },
                {
                    type: 'radio',
                    label: 'production',
                    value: 'prod',
                    checked: this.envMode == 'prod'
                }],
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
                        if (!data || this.envMode == data) {
                            return;
                        }
                        else {
                            this.envMode = data;
                            this.appMode.setEnvironmentMode(data);
                        }
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
}

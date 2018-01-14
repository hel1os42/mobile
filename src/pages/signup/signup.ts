import { AppModeService } from '../../providers/appMode.service';
import { Register } from '../../models/register';
import { StringValidator } from '../../validators/string.validator';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { SignUpCodePage } from '../signup-code/signup-code';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignUpPage {
    formData = { phone: '' };
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
    phoneNumber: string;

    constructor(
        private nav: NavController,
        private auth: AuthService,
        private appMode: AppModeService) {
    }

    updateList(ev) {
        StringValidator.updateList(ev);
    }

    getCode() {
        this.phoneNumber = this.numCode + this.formData.phone;
        let inviteCode = this.auth.getInviteCode();

        this.auth.getReferrerId(inviteCode, this.phoneNumber)
            .subscribe(resp => {
                let register: Register = {
                    phone: resp.phone,
                    code: '',
                    referrer_id: resp.referrer_id,
                }
                this.nav.push(SignUpCodePage, { register: register });
                // this.nav.push(SignUpCodePage, { register: resp })
            })
    }

    limitStr(str: string, length: number) {
        this.formData.phone = StringValidator.stringLimitMax(str, length);
    }


    getDevMode() {
        return this.appMode.getEnvironmentMode() === 'dev';
    }
}

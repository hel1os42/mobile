import {FormControl} from '@angular/forms';


export class StringValidator {

    static stringLimitMax(str: string, length: number) {
        if (str && str.length > length) {
            return str = str.slice(0, str.length - 1);
        }
        else {
            return str;
        }
    }

    static validString(fc: FormControl){
        if(fc.value.replace(/\s+/g,'').length >= 3){
            return (null);
        } else {
            return ({validString: true});
        }
    }

    static updateList(ev) {
        ev.target.value = ev.target.value.replace(/D/g, '');
    }

    static validPhoneChange(ev) {
        ev = (ev.replace(/\D+/g,""));
        if (ev.substring(0,1) != "+"){
            ev = "+" + ev;
        }

        if (ev.length > 15) {
            //alert(ev.target.value.length);
            ev = ev.slice(0, ev.length - 1);
        }
        return ev;
    }
}

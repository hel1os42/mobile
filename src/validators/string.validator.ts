import { FormControl } from '@angular/forms';

export class StringValidator {

    static stringLimitMax(str: string, length: number) {
        if (str && str.length > length) {
            return str = str.slice(0, str.length - 1);
        }
        return str;
    }

    static validString(fc: FormControl) {
        if (fc.value.replace(/\s+/g, '').length >= 3) {
            return (null);
        }
        return ({ validString: true });
    }

    static updateList(ev) {
        ev.target.value = ev.target.value.replace(/D/g, '');
    }

    static validPhoneChange(ev) {
        ev = (ev.replace(/\D+/g, ""));
        if (ev.substring(0, 1) != "+") {
            ev = "+" + ev;
        }

        if (ev.length > 15) {
            //alert(ev.target.value.length);
            ev = ev.slice(0, ev.length - 1);
        }
        return ev;
    }

    static stringAmountLimit(ev) {

        if (ev.target.value.split('.')[0] && ev.target.value.split('.')[0].length > 9) {
            if (ev.target.value.split('.')[1]) {
                ev.target.value = ev.target.value.split('.')[0].substr(0, 9) + '.' + ev.target.value.split('.')[1]
            } else {
                ev.target.value = ev.target.value.split('.')[0].substr(0, 9)
            }
        }
        // check num.1234
        if (ev.target.value.split('.')[1] && ev.target.value.split('.')[1].length > 4) {
            ev.target.value = ev.target.value.split('.')[0] + '.' + ev.target.value.split('.')[1].substr(0, 4);
        }
    }
}

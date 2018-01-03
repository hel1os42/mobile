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

    static updateAmount(ev) {
        var last_text;

        if (!last_text){
            last_text = ev.target.value;
        }

        console.log(last_text);
        console.log(parseFloat(ev.target.value));

        if (ev.target.value){
            last_text = parseFloat(ev.target.value);
        }
        else{
            //alert(last_text);
            ev.target.value = parseFloat(last_text);
        }

        //console.log(last_text);
        //ev.target.value = ev.target.value.replace(/[^.\d]+/g,"").replace( /^([^\.]*\.)|\./g, '$1' );//only numbers and one dot
        //console.log(ev.target.value.indexOf("."));
        //console.log(ev.target.value);
        //console.log(parseFloat(ev.target.value.replace(/,/, '.')));
        // check 123456789.num
        if (ev.target.value.split('.')[0] && ev.target.value.split('.')[0].length > 9){
            ev.target.value = ev.target.value.split('.')[0].substr(0, 9) + '.' + ev.target.value.split('.')[1]
        }

        // check num.1234
        if (ev.target.value.split('.')[1] && ev.target.value.split('.')[1].length > 4){
            ev.target.value = ev.target.value.split('.')[0] + '.' + ev.target.value.split('.')[1].substr(0, 4)
        }
    }
}

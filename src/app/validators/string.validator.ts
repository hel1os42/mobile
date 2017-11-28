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
        if(fc.value.replace(/\s+/g,'').length > 3){
            return (null);
        } else {
            return ({validString: true});
        }
    }
}

import { FormControl } from '@angular/forms';

export class NamberValidator {

  static min = (num: Number) => {
    return (fc: FormControl) => {
      if (fc.value < num && fc.value != '' && typeof(fc.value) !== 'undefined' && fc.value !== null) {
        return ({ min: true });
      } else {
        return (null);
      }
    }
  }
}

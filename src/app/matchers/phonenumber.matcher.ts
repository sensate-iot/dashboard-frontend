/*
 * Phone number form control matcher.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { ErrorStateMatcher } from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

export class PhonenumberMatcher implements ErrorStateMatcher {
  private static isValidPhoneNumber(control : FormControl) : boolean {
    if(control.value.toString().length <= 5)
      return false;

    return true;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    if(!PhonenumberMatcher.isValidPhoneNumber(control))
      return true;

    return control && control.invalid && (control.dirty || control.touched || submitted);
  }
}

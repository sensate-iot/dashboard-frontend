/*
 * Generic form matcher.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { ErrorStateMatcher } from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

export class FormMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;
    return control && control.invalid && (control.dirty || control.touched || submitted);
  }
}

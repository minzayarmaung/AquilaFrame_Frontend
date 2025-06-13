import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static userNameLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // don't validate empty value here (let `Validators.required` handle it)

      return value.length === 12 ? null : { invalidUserNameLength: true };
    };
  }
}

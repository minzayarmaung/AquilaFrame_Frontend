import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static userNameLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null; // don't validate empty value here (let `Validators.required` handle it)

      return value.length === 12 ? null : { invalidUserNameLength: true };
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      console.log('Validating password:', value); // ✅ Debug log
      if (!value) return null;

      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;

      return hasSpecialChar && hasMinLength ? null : { weakPassword: true };
    };
  }


}

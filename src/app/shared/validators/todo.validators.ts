import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TodoValidators {
    // Validate minimum length with custom message
    static minLengthValidator(minLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            
            return control.value.length < minLength
                ? { minlength: { 
                        requiredLength: minLength, 
                        actualLength: control.value.length,
                        message: `Minimum length should be ${minLength} characters`
                    }}
                : null;
        };
    }

    // Validate maximum length with custom message
    static maxLengthValidator(maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            
            return control.value.length > maxLength
                ? { maxlength: {
                        requiredLength: maxLength,
                        actualLength: control.value.length,
                        message: `Maximum length should be ${maxLength} characters`
                    }}
                : null;
        };
    }

    // Validate no special characters
    static noSpecialCharacters(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
            return specialCharsRegex.test(control.value)
                ? { specialChars: { message: 'Special characters are not allowed' }}
                : null;
        };
    }

    // Validate future date
    static futureDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const currentDate = new Date();
            const inputDate = new Date(control.value);

            return inputDate < currentDate
                ? { futureDate: { message: 'Date must be in the future' }}
                : null;
        };
    }

    // Validate priority level
    static priorityValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;

            const validPriorities = ['low', 'medium', 'high'];
            return !validPriorities.includes(control.value.toLowerCase())
                ? { invalidPriority: { message: 'Priority must be low, medium, or high' }}
                : null;
        };
    }
}
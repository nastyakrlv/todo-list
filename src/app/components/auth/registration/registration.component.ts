import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces';
import { TuiButton, TuiError } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiInputModule,
    TuiError,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }

    const userData: IUser = {
      email: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value,
    };

    this.authService.register(userData).subscribe();
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword');
    if (confirmPassword?.touched || confirmPassword?.dirty) {
      return password === confirmPassword?.value ? null : { mismatch: true };
    }

    return null;
  }
}

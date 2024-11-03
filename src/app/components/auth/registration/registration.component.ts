import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services';
import { Router, RouterLink } from '@angular/router';
import { IUser } from 'src/app/interfaces';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiInputModule,
    RouterLink,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef,
    private alerts: TuiAlertService
  ) {
    this.registrationForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }

    const userData: IUser = {
      email: this.registrationForm.get('email')?.value,
      name: this.registrationForm.get('name')?.value,
      password: this.registrationForm.get('password')?.value,
    };

    this.authService
      .register(userData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: IUser) => {
          this.authService.saveUser(user);
          this.router.navigate(['/workplace'])
        },
        error: (err) => {
          this.alerts
            .open(`${err.message}`, { label: 'Ошибка', appearance: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword');
    if (confirmPassword?.touched || confirmPassword?.dirty) {
      return password === confirmPassword?.value ? null : { mismatch: true };
    }

    return null;
  }
}

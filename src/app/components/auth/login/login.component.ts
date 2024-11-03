import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services';
import { IUser } from 'src/app/interfaces';
import { TuiAlertService, TuiButton } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiInputModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alerts: TuiAlertService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService
        .login(email, password)
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
  }
}

import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import type { TuiDialogContext } from '@taiga-ui/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUser } from 'src/app/interfaces';
import { TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TuiButton, ReactiveFormsModule, TuiInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  passwordForm: FormGroup;
  nameForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly dialogs: TuiDialogService,
    private destroyRef: DestroyRef
  ) {
    this.passwordForm = new FormGroup(
      {
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );

    this.nameForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.authService
      .changePassword(this.passwordForm.get('password')?.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: IUser) => {
          this.authService.saveUser(user);
        },
      });
  }

  changeName(): void {
    if (this.nameForm.invalid) {
      return;
    }

    this.authService
      .changeName(this.nameForm.get('name')?.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: IUser) => {
          this.authService.saveUser(user);
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

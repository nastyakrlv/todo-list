import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  TuiIcon,
  TuiButton,
  TuiAutoColorPipe,
  TuiInitialsPipe,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { TuiAvatarStack, TuiAvatar } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { IUserName } from 'src/app/interfaces/user-name.interface';
import { type PolymorpheusContent } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-users-card',
  standalone: true,
  imports: [
    CommonModule,
    TuiIcon,
    TuiButton,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoColorPipe,
    TuiAvatarStack,
    TuiAvatar,
    TuiInitialsPipe,
  ],
  templateUrl: './users-card.component.html',
  styleUrl: './users-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersCardComponent {
  @Input() users: IUserName[] = [];
  @Input() isAdmin = false;

  @Output() addUserInProject = new EventEmitter<string>();
  @Output() deleteUserInProject = new EventEmitter<string>();

  addUserForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', Validators.required),
    },
    { validators: this.nameMatchValidator.bind(this) }
  );

  addUser() {
    if (this.addUserForm.invalid) {
      return;
    }

    const email = this.addUserForm.get('email')?.value;

    this.addUserForm.reset();

    this.addUserInProject.emit(email);
  }

  private nameMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const email = control.get('email')?.value;

    return this?.users?.find((user) => user.email === email)
      ? { match: true }
      : null;
  }

  onUserDelete(email: string) {
    this.deleteUserInProject.emit(email);
  }

  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }
}

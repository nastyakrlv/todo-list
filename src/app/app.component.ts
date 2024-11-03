import { TuiRoot } from '@taiga-ui/core';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services';

@Component({
  standalone: true,
  imports: [RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todo-list';
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.isLoggedIn();
    if (user) {
      this.router.navigate(['/workplace']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
}

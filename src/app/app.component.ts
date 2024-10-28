import { TuiRoot } from '@taiga-ui/core';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'todo-list';
  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      // this.router.navigate(['/project']); //TODO: НИНА сделать перенаправление на рабочую страницу
    } else {
      this.router.navigate(['/auth']);
    }
  }
}

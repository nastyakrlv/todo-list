import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiNavigation } from '@taiga-ui/layout';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-workplace',
  standalone: true,
  imports: [
    CommonModule,
    TuiNavigation,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TuiTabBar
  ],
  templateUrl: './workplace.component.html',
  styleUrl: './workplace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkplaceComponent {
  protected expanded = false;
  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _cdr: ChangeDetectorRef
  ) {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this._cdr.markForCheck();
      });
  }
}

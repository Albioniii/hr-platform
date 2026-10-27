import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../core/auth.service';
import { LeaveService } from '../core/leave.service';
import { AvatarComponent } from '../shared/avatar.component';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  managerOnly?: boolean;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { path: '/requests/new', label: 'Request leave', icon: 'add_circle' },
  { path: '/requests', label: 'My requests', icon: 'list_alt', exact: true },
  { path: '/calendar', label: 'Team calendar', icon: 'calendar_month' },
  { path: '/approvals', label: 'Approvals', icon: 'fact_check', managerOnly: true },
  { path: '/employees', label: 'Employees', icon: 'groups', managerOnly: true },
];

// "Shell" = korniza e aplikacionit: menuja anësore + shiriti sipër + faqja aktuale.
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    AvatarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly leaves = inject(LeaveService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly user = this.auth.currentUser;

  // Në ekrane të vogla (telefon) menuja hapet/mbyllet me buton.
  readonly isHandset = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 900px)')
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly navItems = computed(() =>
    NAV_ITEMS.filter((item) => !item.managerOnly || this.auth.isManager()),
  );

  readonly pendingCount = computed(() => this.leaves.pending().length);

  resetDemo(): void {
    this.leaves.resetDemoData();
    this.snackBar.open('Demo data has been reset', 'OK', { duration: 3000 });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

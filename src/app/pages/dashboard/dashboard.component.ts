import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/auth.service';
import { LeaveService } from '../../core/leave.service';
import { EmployeeService } from '../../core/employee.service';
import { addDays, rangesOverlap, startOfWeek, toISODate, todayISO } from '../../core/date-utils';
import { AvatarComponent } from '../../shared/avatar.component';
import { LeaveTypePipe } from '../../shared/leave-type.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    AvatarComponent,
    LeaveTypePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly leaves = inject(LeaveService);
  private readonly employees = inject(EmployeeService);

  readonly user = this.auth.currentUser;
  readonly isManager = this.auth.isManager;

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // computed() rillogaritet automatikisht kur ndryshojnë signals që lexon brenda.
  readonly balance = computed(() => {
    const user = this.user();
    return user ? this.leaves.balanceFor(user) : null;
  });

  readonly usedPercent = computed(() => {
    const b = this.balance();
    return b && b.allowance > 0 ? Math.round((b.used / b.allowance) * 100) : 0;
  });

  readonly myRequests = computed(() => {
    const user = this.user();
    // E lexojmë signal-in direkt që computed të rifreskohet kur ndryshon lista.
    this.leaves.requests();
    return user ? this.leaves.forEmployee(user.id) : [];
  });

  readonly myPendingCount = computed(
    () => this.myRequests().filter((r) => r.status === 'pending').length,
  );

  /** Pushimet e mia të ardhshme (të aprovuara ose në pritje). */
  readonly upcoming = computed(() => {
    const today = todayISO();
    return this.myRequests()
      .filter((r) => (r.status === 'approved' || r.status === 'pending') && r.endDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, 4);
  });

  /** Kush mungon këtë javë (pushime të aprovuara). */
  readonly outThisWeek = computed(() => {
    const monday = startOfWeek(new Date());
    const weekStart = toISODate(monday);
    const weekEnd = toISODate(addDays(monday, 6));
    return this.leaves
      .requests()
      .filter((r) => r.status === 'approved' && rangesOverlap(r.startDate, r.endDate, weekStart, weekEnd))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((request) => ({ request, employee: this.employees.getById(request.employeeId) }))
      .filter((item) => !!item.employee);
  });

  readonly outTodayCount = computed(() => {
    this.leaves.requests();
    return this.leaves.approvedOn().length;
  });

  readonly teamPendingCount = computed(() => this.leaves.pending().length);
}

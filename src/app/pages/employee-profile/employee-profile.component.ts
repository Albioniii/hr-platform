import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/auth.service';
import { EmployeeService } from '../../core/employee.service';
import { LeaveService } from '../../core/leave.service';
import { AvatarComponent } from '../../shared/avatar.component';
import { LeaveTypePipe } from '../../shared/leave-type.pipe';

// E njëjta faqe përdoret për dy rrugë:
//   /profile        → profili im
//   /employees/:id  → profili i një punonjësi (për menaxherin)
@Component({
  selector: 'app-employee-profile',
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
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
})
export class EmployeeProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly employees = inject(EmployeeService);
  private readonly leaves = inject(LeaveService);

  /** Vjen automatikisht nga URL-ja (:id) falë withComponentInputBinding(). */
  readonly id = input<string>();

  readonly employee = computed(() => {
    const id = this.id();
    return id ? this.employees.getById(Number(id)) : (this.auth.currentUser() ?? undefined);
  });

  readonly isOwnProfile = computed(() => !this.id());

  readonly manager = computed(() => {
    const managerId = this.employee()?.managerId;
    return managerId ? this.employees.getById(managerId) : undefined;
  });

  readonly balance = computed(() => {
    const employee = this.employee();
    this.leaves.requests();
    return employee ? this.leaves.balanceFor(employee) : null;
  });

  readonly usedPercent = computed(() => {
    const b = this.balance();
    return b && b.allowance > 0 ? Math.round((b.used / b.allowance) * 100) : 0;
  });

  readonly history = computed(() => {
    const employee = this.employee();
    this.leaves.requests();
    return employee ? this.leaves.forEmployee(employee.id) : [];
  });

  readonly onLeaveToday = computed(() => {
    const employee = this.employee();
    this.leaves.requests();
    return employee ? this.leaves.isOnLeave(employee.id) : false;
  });
}

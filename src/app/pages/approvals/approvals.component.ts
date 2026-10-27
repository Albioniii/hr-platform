import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { LeaveService } from '../../core/leave.service';
import { EmployeeService } from '../../core/employee.service';
import { Employee, LeaveBalance, LeaveRequest } from '../../core/models';
import { rangesOverlap } from '../../core/date-utils';
import { AvatarComponent } from '../../shared/avatar.component';
import { LeaveTypePipe } from '../../shared/leave-type.pipe';
import { RejectDialogComponent, RejectDialogData } from './reject-dialog.component';

interface ApprovalItem {
  request: LeaveRequest;
  employee: Employee;
  balance: LeaveBalance;
  /** Kolegët që mungojnë në të njëjtat data – ndihmon menaxherin të vendosë. */
  overlapping: string[];
}

@Component({
  selector: 'app-approvals',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    AvatarComponent,
    LeaveTypePipe,
  ],
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss',
})
export class ApprovalsComponent {
  private readonly auth = inject(AuthService);
  private readonly leaves = inject(LeaveService);
  private readonly employees = inject(EmployeeService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly pendingItems = computed<ApprovalItem[]>(() => {
    const all = this.leaves.requests();
    const items: ApprovalItem[] = [];

    for (const request of this.leaves.pending()) {
      const employee = this.employees.getById(request.employeeId);
      if (!employee) continue;

      const overlapping = all
        .filter(
          (other) =>
            other.employeeId !== request.employeeId &&
            other.status === 'approved' &&
            rangesOverlap(other.startDate, other.endDate, request.startDate, request.endDate),
        )
        .map((other) => this.employees.fullName(other.employeeId));

      items.push({ request, employee, balance: this.leaves.balanceFor(employee), overlapping });
    }
    return items;
  });

  readonly history = computed(() =>
    this.leaves
      .requests()
      .filter((r) => (r.status === 'approved' || r.status === 'rejected') && !!r.reviewedAt)
      .sort((a, b) => (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? ''))
      .slice(0, 20)
      .map((request) => ({ request, employee: this.employees.getById(request.employeeId) })),
  );

  approve(item: ApprovalItem): void {
    const manager = this.auth.currentUser();
    if (!manager) return;
    this.leaves.approve(item.request.id, manager.id);
    this.snackBar.open(`Approved leave for ${item.employee.firstName}`, 'OK', { duration: 3000 });
  }

  reject(item: ApprovalItem): void {
    const manager = this.auth.currentUser();
    if (!manager) return;

    const dialogRef = this.dialog.open<RejectDialogComponent, RejectDialogData, string>(
      RejectDialogComponent,
      {
        width: '440px',
        data: { employeeName: item.employee.firstName },
      },
    );

    // afterClosed() është Observable: na njofton kur mbyllet dialogu.
    dialogRef.afterClosed().subscribe((comment) => {
      if (comment) {
        this.leaves.reject(item.request.id, manager.id, comment);
        this.snackBar.open(`Rejected leave for ${item.employee.firstName}`, 'OK', { duration: 3000 });
      }
    });
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { LeaveService } from '../../core/leave.service';
import { LeaveRequest, LeaveStatus } from '../../core/models';
import { LeaveTypePipe } from '../../shared/leave-type.pipe';

type StatusFilter = 'all' | LeaveStatus;

@Component({
  selector: 'app-my-requests',
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    LeaveTypePipe,
  ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss',
})
export class MyRequestsComponent {
  private readonly auth = inject(AuthService);
  private readonly leaves = inject(LeaveService);
  private readonly snackBar = inject(MatSnackBar);

  readonly filter = signal<StatusFilter>('all');
  readonly displayedColumns = ['type', 'dates', 'days', 'status', 'note', 'actions'];

  readonly allRequests = computed(() => {
    const user = this.auth.currentUser();
    this.leaves.requests();
    return user ? this.leaves.forEmployee(user.id) : [];
  });

  readonly rows = computed(() => {
    const filter = this.filter();
    const all = this.allRequests();
    return filter === 'all' ? all : all.filter((r) => r.status === filter);
  });

  setFilter(value: StatusFilter): void {
    this.filter.set(value);
  }

  cancel(request: LeaveRequest): void {
    if (!confirm('Cancel this leave request?')) {
      return;
    }
    this.leaves.cancel(request.id);
    this.snackBar.open('Request cancelled', 'OK', { duration: 3000 });
  }
}

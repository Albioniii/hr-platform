import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaveService } from '../../core/leave.service';
import { EmployeeService } from '../../core/employee.service';
import { DEPARTMENTS, Department, Employee, LeaveRequest } from '../../core/models';
import { addDays, isWeekend, startOfWeek, toISODate, todayISO } from '../../core/date-utils';
import { LeaveTypePipe } from '../../shared/leave-type.pipe';

interface CalendarEntry {
  request: LeaveRequest;
  employee: Employee;
}

interface CalendarDay {
  date: Date;
  iso: string;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  entries: CalendarEntry[];
}

// Kalendari mujor i ekipit, i ndërtuar nga zero (pa librari shtesë).
@Component({
  selector: 'app-team-calendar',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule,
    LeaveTypePipe,
  ],
  templateUrl: './team-calendar.component.html',
  styleUrl: './team-calendar.component.scss',
})
export class TeamCalendarComponent {
  private readonly leaves = inject(LeaveService);
  private readonly employees = inject(EmployeeService);

  readonly departments = DEPARTMENTS;
  readonly weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /** Dita e parë e muajit që po shfaqet. */
  readonly month = signal(this.firstOfMonth(new Date()));
  readonly department = signal<Department | 'all'>('all');
  readonly showPending = signal(true);

  /** Kërkesat që duhet të shfaqen, sipas filtrave. */
  private readonly visibleEntries = computed<CalendarEntry[]>(() => {
    const department = this.department();
    const showPending = this.showPending();
    const entries: CalendarEntry[] = [];

    for (const request of this.leaves.requests()) {
      const visibleStatus = request.status === 'approved' || (showPending && request.status === 'pending');
      if (!visibleStatus) continue;

      const employee = this.employees.getById(request.employeeId);
      if (!employee || (department !== 'all' && employee.department !== department)) continue;

      entries.push({ request, employee });
    }
    return entries;
  });

  /** Rrjeta e kalendarit: lista me javë, secila me 7 ditë. */
  readonly weeks = computed<CalendarDay[][]>(() => {
    const first = this.month();
    const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const gridStart = startOfWeek(first);
    const gridEnd = addDays(startOfWeek(lastDay), 6);
    const today = todayISO();
    const entries = this.visibleEntries();

    const weeks: CalendarDay[][] = [];
    let current = gridStart;
    while (current <= gridEnd) {
      const week: CalendarDay[] = [];
      for (let i = 0; i < 7; i++) {
        const iso = toISODate(current);
        const weekend = isWeekend(current);
        week.push({
          date: current,
          iso,
          inMonth: current.getMonth() === first.getMonth(),
          isToday: iso === today,
          isWeekend: weekend,
          entries: weekend
            ? []
            : entries.filter((e) => e.request.startDate <= iso && iso <= e.request.endDate),
        });
        current = addDays(current, 1);
      }
      weeks.push(week);
    }
    return weeks;
  });

  previousMonth(): void {
    this.month.update((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  nextMonth(): void {
    this.month.update((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.month.set(this.firstOfMonth(new Date()));
  }

  private firstOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}

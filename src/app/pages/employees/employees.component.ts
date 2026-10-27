import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../core/employee.service';
import { LeaveService } from '../../core/leave.service';
import { DEPARTMENTS, Department, Employee } from '../../core/models';
import { AvatarComponent } from '../../shared/avatar.component';

@Component({
  selector: 'app-employees',
  imports: [
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    AvatarComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent {
  private readonly employees = inject(EmployeeService);
  private readonly leaves = inject(LeaveService);
  private readonly router = inject(Router);

  readonly departments = DEPARTMENTS;
  readonly displayedColumns = ['name', 'department', 'email', 'balance', 'status'];

  readonly search = signal('');
  readonly department = signal<Department | 'all'>('all');

  readonly rows = computed(() => {
    const query = this.search().trim().toLowerCase();
    const department = this.department();
    this.leaves.requests(); // që lista të rifreskohet kur ndryshojnë pushimet

    return this.employees
      .employees()
      .filter((e) => department === 'all' || e.department === department)
      .filter(
        (e) =>
          !query ||
          `${e.firstName} ${e.lastName} ${e.position} ${e.email}`.toLowerCase().includes(query),
      )
      .map((employee) => ({
        employee,
        balance: this.leaves.balanceFor(employee),
        onLeave: this.leaves.isOnLeave(employee.id),
      }));
  });

  open(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }
}

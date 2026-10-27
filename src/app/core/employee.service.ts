import { Injectable, signal } from '@angular/core';
import { Employee } from './models';
import { EMPLOYEES } from './mock-data';

// Shërbimi (service) mban të dhënat e punonjësve.
// providedIn: 'root' = një instancë e vetme e përbashkët për gjithë aplikacionin.
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  // Signal = vlerë "reaktive": kur ndryshon, Angular rifreskon automatikisht pamjen.
  private readonly _employees = signal<Employee[]>(EMPLOYEES);
  readonly employees = this._employees.asReadonly();

  getById(id: number): Employee | undefined {
    return this._employees().find((e) => e.id === id);
  }

  fullName(id: number): string {
    const employee = this.getById(id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  }
}

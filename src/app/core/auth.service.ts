import { Injectable, computed, inject, signal } from '@angular/core';
import { Employee } from './models';
import { EmployeeService } from './employee.service';
import { loadFromStorage, removeFromStorage, saveToStorage } from './storage';

// Autentikim i thjeshtë për demo.
// Në një aplikacion real: login dërgohet te serveri, i cili kthen një token (p.sh. JWT).
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly employees = inject(EmployeeService);
  private readonly storageKey = 'peopledesk.session';

  private readonly _currentUser = signal<Employee | null>(this.restoreSession());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isManager = computed(() => this._currentUser()?.role === 'manager');

  login(email: string, password: string): boolean {
    const normalized = email.trim().toLowerCase();
    const employee = this.employees
      .employees()
      .find((e) => e.email.toLowerCase() === normalized && e.password === password);

    if (!employee) {
      return false;
    }
    this._currentUser.set(employee);
    saveToStorage(this.storageKey, employee.id);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    removeFromStorage(this.storageKey);
  }

  private restoreSession(): Employee | null {
    const id = loadFromStorage<number | null>(this.storageKey, null);
    return id === null ? null : (this.employees.getById(id) ?? null);
  }
}

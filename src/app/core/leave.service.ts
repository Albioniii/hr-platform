import { Injectable, computed, effect, signal } from '@angular/core';
import { Employee, LeaveBalance, LeaveRequest, NewLeaveRequest } from './models';
import { createSeedRequests } from './mock-data';
import { countWorkingDays, rangesOverlap, todayISO } from './date-utils';
import { loadFromStorage, saveToStorage } from './storage';

// I gjithë "logjika e biznesit" për kërkesat e pushimit jeton këtu,
// jo te komponentët. Kështu komponentët mbeten të thjeshtë dhe kodi ripërdoret.
@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly storageKey = 'peopledesk.leave-requests.v1';

  private readonly _requests = signal<LeaveRequest[]>(
    loadFromStorage(this.storageKey, createSeedRequests()),
  );
  readonly requests = this._requests.asReadonly();

  /** Kërkesat në pritje, më e vjetra e para. */
  readonly pending = computed(() =>
    this._requests()
      .filter((r) => r.status === 'pending')
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  );

  constructor() {
    // effect() ekzekutohet sa herë ndryshon _requests → i ruajmë automatikisht.
    effect(() => saveToStorage(this.storageKey, this._requests()));
  }

  forEmployee(employeeId: number): LeaveRequest[] {
    return this._requests()
      .filter((r) => r.employeeId === employeeId)
      .sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  create(input: NewLeaveRequest): LeaveRequest {
    const request: LeaveRequest = {
      ...input,
      id: Math.max(0, ...this._requests().map((r) => r.id)) + 1,
      days: countWorkingDays(input.startDate, input.endDate),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this._requests.update((list) => [request, ...list]);
    return request;
  }

  cancel(id: number): void {
    this.patch(id, { status: 'cancelled' });
  }

  approve(id: number, reviewerId: number): void {
    this.patch(id, { status: 'approved', reviewedBy: reviewerId, reviewedAt: new Date().toISOString() });
  }

  reject(id: number, reviewerId: number, comment: string): void {
    this.patch(id, {
      status: 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      reviewComment: comment,
    });
  }

  /** Bilanci i pushimit vjetor për vitin aktual. */
  balanceFor(employee: Employee, year = new Date().getFullYear()): LeaveBalance {
    const annualThisYear = this._requests().filter(
      (r) =>
        r.employeeId === employee.id &&
        r.type === 'annual' &&
        r.startDate.startsWith(String(year)),
    );
    const sum = (status: LeaveRequest['status']) =>
      annualThisYear.filter((r) => r.status === status).reduce((total, r) => total + r.days, 0);

    const used = sum('approved');
    const pending = sum('pending');
    const remaining = employee.annualAllowance - used;
    return { allowance: employee.annualAllowance, used, pending, remaining, available: remaining - pending };
  }

  /** A ka punonjësi tashmë një kërkesë (aktive) që mbivendoset me këto data? */
  hasOverlap(employeeId: number, startDate: string, endDate: string): boolean {
    return this._requests().some(
      (r) =>
        r.employeeId === employeeId &&
        (r.status === 'pending' || r.status === 'approved') &&
        rangesOverlap(r.startDate, r.endDate, startDate, endDate),
    );
  }

  /** Kërkesat e aprovuara që mbulojnë një datë të caktuar. */
  approvedOn(dateIso: string = todayISO()): LeaveRequest[] {
    return this._requests().filter(
      (r) => r.status === 'approved' && r.startDate <= dateIso && dateIso <= r.endDate,
    );
  }

  isOnLeave(employeeId: number, dateIso: string = todayISO()): boolean {
    return this.approvedOn(dateIso).some((r) => r.employeeId === employeeId);
  }

  /** Kthen të dhënat demo në gjendjen fillestare. */
  resetDemoData(): void {
    this._requests.set(createSeedRequests());
  }

  private patch(id: number, changes: Partial<LeaveRequest>): void {
    this._requests.update((list) => list.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }
}

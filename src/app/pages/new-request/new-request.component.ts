import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth.service';
import { LeaveService } from '../../core/leave.service';
import { LEAVE_TYPES, LeaveType } from '../../core/models';
import { countWorkingDays, isWeekend, toISODate } from '../../core/date-utils';

@Component({
  selector: 'app-new-request',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.scss',
})
export class NewRequestComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly leaves = inject(LeaveService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly leaveTypes = LEAVE_TYPES;
  readonly minDate = new Date();

  /** Në kalendar lejohen vetëm ditët e punës si fillim/fund. */
  readonly weekdaysOnly = (date: Date | null): boolean => !!date && !isWeekend(date);

  /**
   * Validator për gjithë formën (jo vetëm një fushë),
   * sepse duhet të shohë njëkohësisht llojin, datën e fillimit dhe të mbarimit.
   */
  private readonly validateRequest = (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('start')?.value as Date | null;
    const end = group.get('end')?.value as Date | null;
    const type = group.get('type')?.value as LeaveType;
    const user = this.auth.currentUser();
    if (!start || !end || !user) {
      return null;
    }

    const startIso = toISODate(start);
    const endIso = toISODate(end);
    const days = countWorkingDays(startIso, endIso);

    if (days === 0) {
      return { noWorkingDays: true };
    }
    if (this.leaves.hasOverlap(user.id, startIso, endIso)) {
      return { overlap: true };
    }
    if (type === 'annual' && days > this.leaves.balanceFor(user).available) {
      return { insufficientBalance: true };
    }
    return null;
  };

  readonly form = this.fb.group(
    {
      type: this.fb.control<LeaveType>('annual', Validators.required),
      start: this.fb.control<Date | null>(null, Validators.required),
      end: this.fb.control<Date | null>(null, Validators.required),
      reason: this.fb.control('', Validators.maxLength(300)),
    },
    { validators: this.validateRequest },
  );

  // toSignal kthen një Observable (valueChanges) në signal, që ta përdorim te computed().
  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  readonly selectedDays = computed(() => {
    const { start, end } = this.formValue();
    return start && end ? countWorkingDays(toISODate(start), toISODate(end)) : 0;
  });

  readonly selectedType = computed(() => this.formValue().type ?? 'annual');

  readonly balance = computed(() => {
    const user = this.auth.currentUser();
    this.leaves.requests();
    return user ? this.leaves.balanceFor(user) : null;
  });

  submit(): void {
    const user = this.auth.currentUser();
    if (this.form.invalid || !user) {
      this.form.markAllAsTouched();
      return;
    }

    const { type, start, end, reason } = this.form.getRawValue();
    if (!start || !end) {
      return;
    }

    this.leaves.create({
      employeeId: user.id,
      type,
      startDate: toISODate(start),
      endDate: toISODate(end),
      reason: reason.trim(),
    });

    this.snackBar.open('Request sent to your manager for approval', 'OK', { duration: 3500 });
    this.router.navigate(['/requests']);
  }
}

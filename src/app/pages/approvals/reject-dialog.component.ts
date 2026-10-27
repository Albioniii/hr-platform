import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface RejectDialogData {
  employeeName: string;
}

// Dritare (dialog) që kërkon arsyen e refuzimit.
// Kur mbyllet, i kthen komentin komponentit që e hapi (ApprovalsComponent).
@Component({
  selector: 'app-reject-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Reject request</h2>
    <mat-dialog-content>
      <p>Let {{ data.employeeName }} know why the request is being rejected.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Reason</mat-label>
        <textarea matInput [formControl]="comment" rows="3" maxlength="200" cdkFocusInitial></textarea>
        @if (comment.hasError('required')) {
          <mat-error>A reason is required</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="danger" [disabled]="comment.invalid" (click)="confirm()">
        Reject
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    p {
      margin-top: 0;
    }
    .danger {
      --mdc-filled-button-container-color: var(--mat-sys-error);
      --mdc-filled-button-label-text-color: var(--mat-sys-on-error);
      --mat-button-filled-container-color: var(--mat-sys-error);
      --mat-button-filled-label-text-color: var(--mat-sys-on-error);
    }
  `,
})
export class RejectDialogComponent {
  readonly data = inject<RejectDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<RejectDialogComponent, string>>(MatDialogRef);

  readonly comment = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)],
  });

  confirm(): void {
    const text = this.comment.value.trim();
    if (text) {
      this.dialogRef.close(text);
    }
  }
}

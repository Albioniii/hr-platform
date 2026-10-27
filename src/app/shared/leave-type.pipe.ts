import { Pipe, PipeTransform } from '@angular/core';
import { LEAVE_TYPES, LeaveType } from '../core/models';

// Pipe = transformon një vlerë në template. Përdorimi: {{ request.type | leaveType }}
@Pipe({ name: 'leaveType' })
export class LeaveTypePipe implements PipeTransform {
  transform(type: LeaveType, part: 'label' | 'icon' = 'label'): string {
    const found = LEAVE_TYPES.find((t) => t.value === type);
    if (!found) {
      return type;
    }
    return part === 'icon' ? found.icon : found.label;
  }
}

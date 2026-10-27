import { Component, computed, input } from '@angular/core';
import { Employee } from '../core/models';

// Komponent i vogël i ripërdorshëm: rrethi me inicialet e punonjësit.
// input() = të dhëna që i jep komponenti prind, p.sh. <app-avatar [employee]="e" [size]="32" />
@Component({
  selector: 'app-avatar',
  template: `
    <span
      class="avatar"
      [style.background]="employee().avatarColor"
      [style.width.px]="size()"
      [style.height.px]="size()"
      [style.font-size.px]="size() * 0.4"
      [attr.aria-label]="employee().firstName + ' ' + employee().lastName"
      >{{ initials() }}</span
    >
  `,
  styles: `
    :host {
      display: inline-flex;
    }
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #fff;
      font-weight: 500;
      flex-shrink: 0;
      user-select: none;
    }
  `,
})
export class AvatarComponent {
  readonly employee = input.required<Employee>();
  readonly size = input(40);

  readonly initials = computed(
    () => `${this.employee().firstName.charAt(0)}${this.employee().lastName.charAt(0)}`,
  );
}

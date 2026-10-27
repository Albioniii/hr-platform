import { Routes } from '@angular/router';
import { authGuard, guestGuard, managerGuard } from './core/guards';
import { ShellComponent } from './layout/shell.component';

// Të gjitha faqet e aplikacionit.
// loadComponent = "lazy loading": kodi i faqes shkarkohet vetëm kur hapet ajo faqe.
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Sign in · PeopleDesk',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Të gjitha faqet brenda "shell" kanë menunë anësore dhe kërkojnë login.
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · PeopleDesk',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'requests',
        title: 'My requests · PeopleDesk',
        loadComponent: () =>
          import('./pages/my-requests/my-requests.component').then((m) => m.MyRequestsComponent),
      },
      {
        path: 'requests/new',
        title: 'Request leave · PeopleDesk',
        loadComponent: () =>
          import('./pages/new-request/new-request.component').then((m) => m.NewRequestComponent),
      },
      {
        path: 'calendar',
        title: 'Team calendar · PeopleDesk',
        loadComponent: () =>
          import('./pages/team-calendar/team-calendar.component').then(
            (m) => m.TeamCalendarComponent,
          ),
      },
      {
        path: 'profile',
        title: 'My profile · PeopleDesk',
        loadComponent: () =>
          import('./pages/employee-profile/employee-profile.component').then(
            (m) => m.EmployeeProfileComponent,
          ),
      },
      {
        path: 'approvals',
        canActivate: [managerGuard],
        title: 'Approvals · PeopleDesk',
        loadComponent: () =>
          import('./pages/approvals/approvals.component').then((m) => m.ApprovalsComponent),
      },
      {
        path: 'employees',
        canActivate: [managerGuard],
        title: 'Employees · PeopleDesk',
        loadComponent: () =>
          import('./pages/employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: 'employees/:id',
        canActivate: [managerGuard],
        title: 'Employee · PeopleDesk',
        loadComponent: () =>
          import('./pages/employee-profile/employee-profile.component').then(
            (m) => m.EmployeeProfileComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

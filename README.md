# PeopleDesk – HR Leave Management Platform

A leave and employee management platform built with **Angular 20** and **Angular Material**.
Employees request time off, managers approve or reject requests, and everyone can see who is out on a shared team calendar.

> Live demo: _add your Netlify/Vercel link here_

## Features

- **Authentication with roles** – employee and manager accounts, protected routes with functional route guards
- **Dashboard** – live annual-leave balance, pending requests, upcoming leave and who is out this week
- **Leave requests** – reactive form with a date-range picker, working-day calculation (weekends excluded) and validation for overlapping dates and insufficient balance
- **Approval workflow** – managers approve or reject (with a required reason in a dialog) and see which colleagues are already out on the same dates
- **Team calendar** – custom monthly calendar built from scratch, filterable by department, showing approved and pending leave
- **Employee directory** – searchable and filterable table with leave balance and today's status
- **Employee profiles** – details, leave balance and full leave history
- **Responsive layout** – collapsible side navigation on mobile
- **Persistence** – data is stored in `localStorage`, with a "Reset demo data" option

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Angular 20 (standalone components, new control flow `@if` / `@for`) |
| State | Angular Signals (`signal`, `computed`, `effect`, `input`) + RxJS interop |
| Forms | Typed Reactive Forms with custom group validators |
| UI | Angular Material 3 (sidenav, table, datepicker, dialog, tabs, snackbar…) |
| Routing | Lazy-loaded routes, functional guards, route params bound to component inputs |
| Language | TypeScript (strict mode) |

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Employee | albion@peopledesk.demo | demo123 |
| Manager | arta@peopledesk.demo | demo123 |

## Getting started

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm start
```

The app opens at http://localhost:4200.

To create a production build:

```bash
npm run build
```

The output is written to `dist/hr-platform/browser`.

## Project structure

```
src/app
├── core/          # models, services (auth, employees, leave), guards, date helpers, mock data
├── shared/        # reusable avatar component and leave-type pipe
├── layout/        # app shell: side navigation + toolbar
└── pages/         # login, dashboard, my-requests, new-request, approvals,
                   # team-calendar, employees, employee-profile
```

## Possible next steps

- Replace the mock data with a real REST API (Node.js/Express or JSON Server) using `HttpClient`
- Add public holidays to the working-day calculation
- Unit tests with Jasmine/Jest and end-to-end tests with Cypress
- Email notifications when a request is approved or rejected

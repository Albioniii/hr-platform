// Të dhëna demo. Në një projekt real këto do të vinin nga një API (backend).
import { Employee, LeaveRequest, LeaveStatus, LeaveType } from './models';
import { addDays, addWorkingDays, countWorkingDays, toISODate } from './date-utils';

const DEMO_PASSWORD = 'demo123';

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    firstName: 'Albion',
    lastName: 'Halili',
    email: 'albion@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'manager',
    department: 'HR',
    position: 'HR Manager',
    managerId: null,
    startDate: '2019-03-01',
    phone: '+383 44 120 001',
    annualAllowance: 24,
    avatarColor: '#6a1b9a',
  },
  {
    id: 2,
    firstName: 'Artan',
    lastName: 'Krasniqi',
    email: 'artan,krasniqi@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Engineering',
    position: 'Frontend Developer',
    managerId: 1,
    startDate: '2025-02-10',
    phone: '+383 45 950 999',
    annualAllowance: 20,
    avatarColor: '#005cbb',
  },
  {
    id: 3,
    firstName: 'Driton',
    lastName: 'Berisha',
    email: 'driton@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Engineering',
    position: 'Backend Developer',
    managerId: 1,
    startDate: '2021-06-14',
    phone: '+383 44 120 003',
    annualAllowance: 21,
    avatarColor: '#00796b',
  },
  {
    id: 4,
    firstName: 'Blerta',
    lastName: 'Gashi',
    email: 'blerta@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Design',
    position: 'UI/UX Designer',
    managerId: 1,
    startDate: '2022-09-01',
    phone: '+383 44 120 004',
    annualAllowance: 20,
    avatarColor: '#c2185b',
  },
  {
    id: 5,
    firstName: 'Leotrim',
    lastName: 'Morina',
    email: 'leotrim@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Engineering',
    position: 'DevOps Engineer',
    managerId: 1,
    startDate: '2020-01-20',
    phone: '+383 44 120 005',
    annualAllowance: 22,
    avatarColor: '#ef6c00',
  },
  {
    id: 6,
    firstName: 'Vjosa',
    lastName: 'Hoxha',
    email: 'vjosa@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Specialist',
    managerId: 1,
    startDate: '2023-04-03',
    phone: '+383 44 120 006',
    annualAllowance: 20,
    avatarColor: '#2e7d32',
  },
  {
    id: 7,
    firstName: 'Fatlum',
    lastName: 'Shala',
    email: 'fatlum@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Finance',
    position: 'Financial Analyst',
    managerId: 1,
    startDate: '2021-11-15',
    phone: '+383 44 120 007',
    annualAllowance: 21,
    avatarColor: '#455a64',
  },
  {
    id: 8,
    firstName: 'Edona',
    lastName: 'Rexhepi',
    email: 'edona@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Engineering',
    position: 'QA Engineer',
    managerId: 1,
    startDate: '2024-07-01',
    phone: '+383 44 120 008',
    annualAllowance: 20,
    avatarColor: '#5d4037',
  },
  {
    id: 9,
    firstName: 'Granit',
    lastName: 'Kelmendi',
    email: 'granit@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Design',
    position: 'Product Designer',
    managerId: 1,
    startDate: '2022-02-14',
    phone: '+383 44 120 009',
    annualAllowance: 20,
    avatarColor: '#0277bd',
  },
  {
    id: 10,
    firstName: 'Lirie',
    lastName: 'Bytyqi',
    email: 'lirie@peopledesk.demo',
    password: DEMO_PASSWORD,
    role: 'employee',
    department: 'Finance',
    position: 'Accountant',
    managerId: 1,
    startDate: '2018-10-08',
    phone: '+383 44 120 010',
    annualAllowance: 25,
    avatarColor: '#ad1457',
  },
];

/**
 * Krijon kërkesa demo në lidhje me datën e sotme,
 * që kalendari dhe dashboard-i të kenë gjithmonë të dhëna për t'u shfaqur.
 */
export function createSeedRequests(): LeaveRequest[] {
  const today = new Date();
  let nextId = 1;

  const make = (
    employeeId: number,
    type: LeaveType,
    startOffset: number,
    length: number,
    status: LeaveStatus,
    reason: string,
    reviewComment?: string,
  ): LeaveRequest => {
    const start = addWorkingDays(today, startOffset);
    const end = addWorkingDays(start, length - 1);
    const startDate = toISODate(start);
    const endDate = toISODate(end);
    const createdAt = addDays(start, -14).toISOString();
    const reviewed = status === 'approved' || status === 'rejected';
    return {
      id: nextId++,
      employeeId,
      type,
      startDate,
      endDate,
      days: countWorkingDays(startDate, endDate),
      reason,
      status,
      createdAt,
      ...(reviewed
        ? { reviewedBy: 1, reviewedAt: addDays(start, -10).toISOString(), reviewComment }
        : {}),
    };
  };

  return [
    make(2, 'annual', 8, 5, 'approved', 'Family trip to Albania'),
    make(2, 'sick', -25, 2, 'approved', 'Flu'),
    make(2, 'personal', 20, 1, 'pending', 'Moving to a new apartment'),
    make(3, 'annual', -1, 3, 'approved', 'Short break'),
    make(3, 'annual', -40, 5, 'approved', 'Summer holiday'),
    make(4, 'annual', 5, 3, 'pending', 'Design conference in Vienna'),
    make(5, 'sick', -3, 2, 'approved', 'Doctor appointment'),
    make(6, 'annual', 12, 5, 'pending', 'Wedding of a family member'),
    make(7, 'annual', 2, 2, 'approved', 'Long weekend'),
    make(8, 'unpaid', 15, 3, 'rejected', 'Personal travel', 'Release week – please pick other dates.'),
    make(9, 'annual', 0, 2, 'approved', 'Rest days'),
    make(10, 'personal', 3, 1, 'pending', 'Bank and paperwork'),
    make(1, 'annual', 25, 5, 'approved', 'Winter holiday'),
  ];
}

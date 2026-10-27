// Modelet (tipet) e të dhënave. TypeScript na ndihmon të mos gabojmë emrat e fushave.

export type Role = 'employee' | 'manager';

export type Department = 'Engineering' | 'Design' | 'Marketing' | 'Finance' | 'HR';

export const DEPARTMENTS: Department[] = ['Engineering', 'Design', 'Marketing', 'Finance', 'HR'];

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  /** Vetëm për demo! Në një aplikacion real fjalëkalimet ruhen të enkriptuara në server. */
  password: string;
  role: Role;
  department: Department;
  position: string;
  managerId: number | null;
  startDate: string; // format ISO: yyyy-MM-dd
  phone: string;
  /** Ditët e pushimit vjetor në vit (në Kosovë minimumi ligjor është 20 ditë pune). */
  annualAllowance: number;
  avatarColor: string;
}

export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  type: LeaveType;
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
  /** Numri i ditëve të punës (pa fundjavë). */
  days: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string; // ISO datetime
  reviewedBy?: number;
  reviewedAt?: string;
  reviewComment?: string;
}

/** Të dhënat që plotëson punonjësi kur krijon një kërkesë të re. */
export type NewLeaveRequest = Pick<
  LeaveRequest,
  'employeeId' | 'type' | 'startDate' | 'endDate' | 'reason'
>;

export interface LeaveBalance {
  /** Ditët totale në vit. */
  allowance: number;
  /** Ditët e aprovuara (të përdorura). */
  used: number;
  /** Ditët në pritje të aprovimit. */
  pending: number;
  /** allowance - used */
  remaining: number;
  /** remaining - pending: sa ditë mund të kërkojë ende. */
  available: number;
}

export const LEAVE_TYPES: { value: LeaveType; label: string; icon: string }[] = [
  { value: 'annual', label: 'Annual leave', icon: 'beach_access' },
  { value: 'sick', label: 'Sick leave', icon: 'local_hospital' },
  { value: 'personal', label: 'Personal day', icon: 'event' },
  { value: 'unpaid', label: 'Unpaid leave', icon: 'money_off' },
];

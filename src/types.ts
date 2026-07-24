export interface SettingsConfig {
  currency: string;
  fyStart: string;
  otMultiplier: number;
  warnHigh: number; // e.g. 0.85
  warnLow: number;  // e.g. 0.40
  totalMonths: number;
}

export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  empId: string;
  empName: string;
  deptId: string;
  deptName: string;
  position: string;
  baseHourlyRate: number;
  annualContractHours: number;
  status: EmployeeStatus;
}

export interface DeptLogEntry {
  id: string;
  deptId: string; // e.g. 'Dept_1'
  month: string;  // e.g. '2026-01'
  empId: string;
  regularHours: number;
  otHours: number;
  allowances: number;
  notes: string;
}

export interface DepartmentMeta {
  id: string;        // 'Dept_1', 'Dept_2', ... 'Dept_7'
  deptCode: string;  // 'D01', 'D02', ... 'D07'
  name: string;      // 'Executive & Operations', etc.
  shortName: string; // 'Dept 1', etc.
}

export interface CalculatedLogEntry extends DeptLogEntry {
  empName: string;
  deptName: string;
  baseHourlyRate: number;
  totalHours: number;
  basePay: number;
  otPay: number;
  grossPay: number;
}

export interface CalculatedEmployee extends Employee {
  monthlyTargetHours: number;
  dataCheck: 'Normal' | 'Duplicate ID' | 'Missing Info';
}

export interface DeptPayrollSummaryItem {
  deptId: string;
  deptCode: string;
  deptName: string;
  totalBasePay: number;
  totalOtPay: number;
  totalAllowances: number;
  totalGrossPay: number;
  ytdGrossPay: number;
  otRatio: number; // otPay / grossPay
}

export type RiskStatus = 'Overtime Risk' | 'Capacity Idle' | 'Normal Range';

export interface EmployeeHoursSummaryItem {
  empId: string;
  empName: string;
  deptName: string;
  position: string;
  contractHours: number;
  ytdActualHours: number;
  remainingHours: number;
  utilizationRate: number; // ytdActualHours / contractHours
  riskStatus: RiskStatus;
}

export interface DashboardKPIs {
  totalYtdGrossPay: number;
  totalContractHours: number;
  totalYtdActualHours: number;
  avgUtilizationRate: number;
  highRiskCount: number;
  idleCount: number;
}

export interface AppDataBackup {
  version: string;
  exportedAt: string;
  settings: SettingsConfig;
  employees: Employee[];
  deptLogs: Record<string, DeptLogEntry[]>;
}

export type NavigationTab = 
  | 'dashboard'
  | 'settings'
  | 'employee_master'
  | 'dept_1'
  | 'dept_2'
  | 'dept_3'
  | 'dept_4'
  | 'dept_5'
  | 'dept_6'
  | 'dept_7'
  | 'payroll_summary'
  | 'annual_hours_tracker';

import { DepartmentMeta, Employee, DeptLogEntry, SettingsConfig } from '../types';

export const DEPARTMENTS: DepartmentMeta[] = [
  { id: 'dept_1', deptCode: 'D01', name: 'Executive & Operations', shortName: 'Dept 1' },
  { id: 'dept_2', deptCode: 'D02', name: 'Sales & Marketing', shortName: 'Dept 2' },
  { id: 'dept_3', deptCode: 'D03', name: 'Engineering & Technology', shortName: 'Dept 3' },
  { id: 'dept_4', deptCode: 'D04', name: 'Customer Support & Operations', shortName: 'Dept 4' },
  { id: 'dept_5', deptCode: 'D05', name: 'Finance, Legal & Compliance', shortName: 'Dept 5' },
  { id: 'dept_6', deptCode: 'D06', name: 'HR & Workplace Admin', shortName: 'Dept 6' },
  { id: 'dept_7', deptCode: 'D07', name: 'R&D & Product Strategy', shortName: 'Dept 7' },
];

export const DEFAULT_SETTINGS: SettingsConfig = {
  currency: '$',
  fyStart: '2026-01-01',
  otMultiplier: 1.50,
  warnHigh: 0.85,
  warnLow: 0.40,
  totalMonths: 12,
};

export const DEFAULT_EMPLOYEES: Employee[] = [
  // Dept 1 - Executive & Ops
  { empId: 'EMP001', empName: 'Arthur Morgan', deptId: 'D01', deptName: 'Executive & Operations', position: 'VP of Operations', baseHourlyRate: 75.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP002', empName: 'Sadie Adler', deptId: 'D01', deptName: 'Executive & Operations', position: 'Operations Manager', baseHourlyRate: 52.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP003', empName: 'John Marston', deptId: 'D01', deptName: 'Executive & Operations', position: 'Logistics Supervisor', baseHourlyRate: 38.50, annualContractHours: 2080, status: 'Active' },

  // Dept 2 - Sales & Mktg
  { empId: 'EMP004', empName: 'Charles Smith', deptId: 'D02', deptName: 'Sales & Marketing', position: 'Sales Director', baseHourlyRate: 68.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP005', empName: 'Abigail Roberts', deptId: 'D02', deptName: 'Sales & Marketing', position: 'Senior AE', baseHourlyRate: 45.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP006', empName: 'Javier Escuella', deptId: 'D02', deptName: 'Sales & Marketing', position: 'Marketing Lead', baseHourlyRate: 42.00, annualContractHours: 2080, status: 'Active' },

  // Dept 3 - Engineering & Tech
  { empId: 'EMP007', empName: 'Lenny Summers', deptId: 'D03', deptName: 'Engineering & Technology', position: 'Principal Engineer', baseHourlyRate: 85.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP008', empName: 'Tilly Jackson', deptId: 'D03', deptName: 'Engineering & Technology', position: 'Senior Backend Engineer', baseHourlyRate: 65.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP009', empName: 'Hosea Matthews', deptId: 'D03', deptName: 'Engineering & Technology', position: 'DevOps Architect', baseHourlyRate: 72.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP010', empName: 'Sean MacGuire', deptId: 'D03', deptName: 'Engineering & Technology', position: 'Frontend Developer', baseHourlyRate: 48.00, annualContractHours: 1800, status: 'Active' },

  // Dept 4 - Customer Support
  { empId: 'EMP011', empName: 'Mary-Beth Gaskill', deptId: 'D04', deptName: 'Customer Support & Operations', position: 'Support Team Lead', baseHourlyRate: 36.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP012', empName: 'Uncle O\'Brian', deptId: 'D04', deptName: 'Customer Support & Operations', position: 'Tier 1 Support Agent', baseHourlyRate: 24.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP013', empName: 'Karen Jones', deptId: 'D04', deptName: 'Customer Support & Operations', position: 'Customer Success Specialist', baseHourlyRate: 32.00, annualContractHours: 2080, status: 'Active' },

  // Dept 5 - Finance & Legal
  { empId: 'EMP014', empName: 'Leopold Strauss', deptId: 'D05', deptName: 'Finance, Legal & Compliance', position: 'Chief Financial Controller', baseHourlyRate: 80.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP015', empName: 'Josiah Trelawny', deptId: 'D05', deptName: 'Finance, Legal & Compliance', position: 'Legal Counsel', baseHourlyRate: 78.00, annualContractHours: 1600, status: 'Active' },

  // Dept 6 - HR & Admin
  { empId: 'EMP016', empName: 'Susan Grimshaw', deptId: 'D06', deptName: 'HR & Workplace Admin', position: 'HR Director', baseHourlyRate: 58.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP017', empName: 'Pearson Simon', deptId: 'D06', deptName: 'HR & Workplace Admin', position: 'Office Administrator', baseHourlyRate: 28.00, annualContractHours: 2080, status: 'Active' },

  // Dept 7 - R&D & Product
  { empId: 'EMP018', empName: 'Kieran Duffy', deptId: 'D07', deptName: 'R&D & Product Strategy', position: 'Product Manager', baseHourlyRate: 62.00, annualContractHours: 2080, status: 'Active' },
  { empId: 'EMP019', empName: 'Micah Bell', deptId: 'D07', deptName: 'R&D & Product Strategy', position: 'UX Researcher', baseHourlyRate: 46.00, annualContractHours: 2080, status: 'Inactive' },
  { empId: 'EMP020', empName: 'Reverend Swanson', deptId: 'D07', deptName: 'R&D & Product Strategy', position: 'Data Scientist', baseHourlyRate: 70.00, annualContractHours: 2080, status: 'Active' }
];

export const DEFAULT_DEPT_LOGS: Record<string, DeptLogEntry[]> = {
  dept_1: [
    { id: 'log-101', deptId: 'dept_1', month: '2026-01', empId: 'EMP001', regularHours: 173.33, otHours: 15.0, allowances: 500, notes: 'Q1 Logistics Strategy' },
    { id: 'log-102', deptId: 'dept_1', month: '2026-01', empId: 'EMP002', regularHours: 173.33, otHours: 8.5, allowances: 250, notes: 'Vendor Audit' },
    { id: 'log-103', deptId: 'dept_1', month: '2026-01', empId: 'EMP003', regularHours: 160.00, otHours: 22.0, allowances: 300, notes: 'Warehouse Migration' },
    { id: 'log-104', deptId: 'dept_1', month: '2026-02', empId: 'EMP001', regularHours: 168.00, otHours: 18.0, allowances: 500, notes: 'Executive Board Prep' },
    { id: 'log-105', deptId: 'dept_1', month: '2026-02', empId: 'EMP002', regularHours: 168.00, otHours: 12.0, allowances: 250, notes: 'Ops Optimization' },
  ],
  dept_2: [
    { id: 'log-201', deptId: 'dept_2', month: '2026-01', empId: 'EMP004', regularHours: 173.33, otHours: 32.0, allowances: 1200, notes: 'Enterprise Deal Closing' },
    { id: 'log-202', deptId: 'dept_2', month: '2026-01', empId: 'EMP005', regularHours: 173.33, otHours: 28.5, allowances: 850, notes: 'Q1 Sales Campaign' },
    { id: 'log-203', deptId: 'dept_2', month: '2026-01', empId: 'EMP006', regularHours: 160.00, otHours: 10.0, allowances: 400, notes: 'Brand Relaunch' },
    { id: 'log-204', deptId: 'dept_2', month: '2026-02', empId: 'EMP004', regularHours: 168.00, otHours: 35.0, allowances: 1500, notes: 'Global Partner Summit' },
  ],
  dept_3: [
    { id: 'log-301', deptId: 'dept_3', month: '2026-01', empId: 'EMP007', regularHours: 173.33, otHours: 42.0, allowances: 600, notes: 'Core System Refactor Overtime' },
    { id: 'log-302', deptId: 'dept_3', month: '2026-01', empId: 'EMP008', regularHours: 173.33, otHours: 38.0, allowances: 400, notes: 'Database Migration' },
    { id: 'log-303', deptId: 'dept_3', month: '2026-01', empId: 'EMP009', regularHours: 173.33, otHours: 45.0, allowances: 500, notes: 'Cloud Security Hardening' },
    { id: 'log-304', deptId: 'dept_3', month: '2026-01', empId: 'EMP010', regularHours: 150.00, otHours: 15.0, allowances: 200, notes: 'UI Refresh' },
    { id: 'log-305', deptId: 'dept_3', month: '2026-02', empId: 'EMP007', regularHours: 168.00, otHours: 48.0, allowances: 750, notes: 'Emergency Patch Deployment' },
    { id: 'log-306', deptId: 'dept_3', month: '2026-02', empId: 'EMP009', regularHours: 168.00, otHours: 40.0, allowances: 500, notes: 'Infra Automation' },
  ],
  dept_4: [
    { id: 'log-401', deptId: 'dept_4', month: '2026-01', empId: 'EMP011', regularHours: 173.33, otHours: 14.0, allowances: 200, notes: 'Ticket Backlog Clearing' },
    { id: 'log-402', deptId: 'dept_4', month: '2026-01', empId: 'EMP012', regularHours: 90.00, otHours: 0.0, allowances: 0, notes: 'Partial Attendance' },
    { id: 'log-403', deptId: 'dept_4', month: '2026-01', empId: 'EMP013', regularHours: 160.00, otHours: 5.0, allowances: 150, notes: 'VIP Client Onboarding' },
  ],
  dept_5: [
    { id: 'log-501', deptId: 'dept_5', month: '2026-01', empId: 'EMP014', regularHours: 173.33, otHours: 25.0, allowances: 800, notes: 'Annual Tax Audit' },
    { id: 'log-502', deptId: 'dept_5', month: '2026-01', empId: 'EMP015', regularHours: 120.00, otHours: 0.0, allowances: 0, notes: 'Contract Review' },
  ],
  dept_6: [
    { id: 'log-601', deptId: 'dept_6', month: '2026-01', empId: 'EMP016', regularHours: 173.33, otHours: 10.0, allowances: 300, notes: 'Annual Review Cycle' },
    { id: 'log-602', deptId: 'dept_6', month: '2026-01', empId: 'EMP017', regularHours: 160.00, otHours: 2.0, allowances: 100, notes: 'Facility Management' },
  ],
  dept_7: [
    { id: 'log-701', deptId: 'dept_7', month: '2026-01', empId: 'EMP018', regularHours: 173.33, otHours: 18.0, allowances: 400, notes: 'New AI Prototype' },
    { id: 'log-702', deptId: 'dept_7', month: '2026-01', empId: 'EMP020', regularHours: 173.33, otHours: 26.0, allowances: 500, notes: 'Predictive Model Training' },
  ],
};

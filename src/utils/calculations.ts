import {
  SettingsConfig,
  Employee,
  DeptLogEntry,
  CalculatedEmployee,
  CalculatedLogEntry,
  DeptPayrollSummaryItem,
  EmployeeHoursSummaryItem,
  DashboardKPIs,
  RiskStatus,
} from '../types';
import { DEPARTMENTS } from '../data/defaultData';

/**
 * Excel Employee_Master Row Calculation
 * Formula 1: Monthly_Target_Hours = Annual_Contract_Hours / Settings.totalMonths
 * Formula 2: Data_Check = IF(COUNTIF(A:A, A2)>1, "⚠️ Duplicate ID", "✅ Normal")
 */
export function calculateEmployee(
  emp: Employee,
  allEmployees: Employee[],
  settings: SettingsConfig
): CalculatedEmployee {
  const monthlyTargetHours = settings.totalMonths > 0 
    ? emp.annualContractHours / settings.totalMonths 
    : 0;

  const duplicateCount = allEmployees.filter(
    (e) => e.empId.trim().toLowerCase() === emp.empId.trim().toLowerCase()
  ).length;

  let dataCheck: 'Normal' | 'Duplicate ID' | 'Missing Info' = 'Normal';
  if (duplicateCount > 1) {
    dataCheck = 'Duplicate ID';
  } else if (!emp.empId || !emp.empName || emp.baseHourlyRate <= 0) {
    dataCheck = 'Missing Info';
  }

  return {
    ...emp,
    monthlyTargetHours,
    dataCheck,
  };
}

/**
 * Excel Dept_1~7 Row Calculation (XLOOKUP & Math formulas)
 * Formula 1: Emp_Name = XLOOKUP(Emp_ID, Employee_Master.Emp_ID, Employee_Master.Emp_Name, "Unidentified Employee")
 * Formula 2: Total_Hours = Regular_Hours + OT_Hours
 * Formula 3: Base_Pay = Regular_Hours * Base_Hourly_Rate
 * Formula 4: OT_Pay = OT_Hours * Base_Hourly_Rate * Settings.otMultiplier
 * Formula 5: Gross_Pay = Base_Pay + OT_Pay + Allowances
 */
export function calculateLogEntry(
  log: DeptLogEntry,
  employees: Employee[],
  settings: SettingsConfig
): CalculatedLogEntry {
  const emp = employees.find(
    (e) => e.empId.trim().toLowerCase() === log.empId.trim().toLowerCase()
  );

  const empName = emp ? emp.empName : 'Unidentified Employee';
  const deptName = emp ? emp.deptName : 'Unassigned';
  const baseHourlyRate = emp ? emp.baseHourlyRate : 0;

  const totalHours = (log.regularHours || 0) + (log.otHours || 0);
  const basePay = (log.regularHours || 0) * baseHourlyRate;
  const otPay = (log.otHours || 0) * baseHourlyRate * (settings.otMultiplier || 1.5);
  const grossPay = basePay + otPay + (log.allowances || 0);

  return {
    ...log,
    empName,
    deptName,
    baseHourlyRate,
    totalHours,
    basePay,
    otPay,
    grossPay,
  };
}

/**
 * Excel Payroll_Summary Department Consolidation (SUMIFS across all 7 Dept sheets)
 */
export function calculatePayrollSummary(
  allDeptLogs: Record<string, DeptLogEntry[]>,
  employees: Employee[],
  settings: SettingsConfig,
  filterMonth?: string
): DeptPayrollSummaryItem[] {
  return DEPARTMENTS.map((deptMeta) => {
    // Get all logs for this department key
    const rawLogs = allDeptLogs[deptMeta.id] || [];
    
    // Calculate each entry
    const calcLogs = rawLogs.map((log) => calculateLogEntry(log, employees, settings));

    // Filter by month if selected
    const monthFilteredLogs = filterMonth
      ? calcLogs.filter((l) => l.month === filterMonth)
      : calcLogs;

    const totalBasePay = monthFilteredLogs.reduce((sum, l) => sum + l.basePay, 0);
    const totalOtPay = monthFilteredLogs.reduce((sum, l) => sum + l.otPay, 0);
    const totalAllowances = monthFilteredLogs.reduce((sum, l) => sum + l.allowances, 0);
    const totalGrossPay = monthFilteredLogs.reduce((sum, l) => sum + l.grossPay, 0);

    // YTD is always across all months up to now
    const ytdGrossPay = calcLogs.reduce((sum, l) => sum + l.grossPay, 0);

    const otRatio = totalGrossPay > 0 ? totalOtPay / totalGrossPay : 0;

    return {
      deptId: deptMeta.id,
      deptCode: deptMeta.deptCode,
      deptName: deptMeta.name,
      totalBasePay,
      totalOtPay,
      totalAllowances,
      totalGrossPay,
      ytdGrossPay,
      otRatio,
    };
  });
}

/**
 * Excel Annual_Hours_Tracker (YTD Hours & Capacity Risk Calculation)
 * Formula 1: YTD_Actual_Hours = SUMIFS across Dept 1~7 for Emp_ID
 * Formula 2: Remaining_Hours = Contract_Hours - YTD_Actual_Hours
 * Formula 3: Utilization_Rate = YTD_Actual_Hours / Contract_Hours
 * Formula 4: Risk_Status = IF(Utilization >= Settings.warnHigh, "⚠️ Overtime Risk", IF(Utilization <= Settings.warnLow, "🔵 Capacity Idle", "✅ Normal Range"))
 */
export function calculateAnnualHoursTracker(
  allDeptLogs: Record<string, DeptLogEntry[]>,
  employees: Employee[],
  settings: SettingsConfig
): EmployeeHoursSummaryItem[] {
  // Combine all logs across all 7 departments
  const allLogs: DeptLogEntry[] = [];
  Object.values(allDeptLogs).forEach((logs) => {
    allLogs.push(...logs);
  });

  return employees.map((emp) => {
    // Find all log items for this employee
    const empLogs = allLogs.filter(
      (l) => l.empId.trim().toLowerCase() === emp.empId.trim().toLowerCase()
    );

    const ytdActualHours = empLogs.reduce((sum, l) => {
      const reg = l.regularHours || 0;
      const ot = l.otHours || 0;
      return sum + reg + ot;
    }, 0);

    const contractHours = emp.annualContractHours || 2080;
    const remainingHours = contractHours - ytdActualHours;
    const utilizationRate = contractHours > 0 ? ytdActualHours / contractHours : 0;

    let riskStatus: RiskStatus = 'Normal Range';
    if (utilizationRate >= settings.warnHigh) {
      riskStatus = 'Overtime Risk';
    } else if (utilizationRate <= settings.warnLow) {
      riskStatus = 'Capacity Idle';
    }

    return {
      empId: emp.empId,
      empName: emp.empName,
      deptName: emp.deptName,
      position: emp.position,
      contractHours,
      ytdActualHours,
      remainingHours,
      utilizationRate,
      riskStatus,
    };
  });
}

/**
 * Executive Dashboard KPIs Calculation
 */
export function calculateDashboardKPIs(
  allDeptLogs: Record<string, DeptLogEntry[]>,
  employees: Employee[],
  settings: SettingsConfig
): DashboardKPIs {
  const trackerItems = calculateAnnualHoursTracker(allDeptLogs, employees, settings);
  const summaryItems = calculatePayrollSummary(allDeptLogs, employees, settings);

  const totalYtdGrossPay = summaryItems.reduce((sum, item) => sum + item.ytdGrossPay, 0);
  const totalContractHours = trackerItems.reduce((sum, item) => sum + item.contractHours, 0);
  const totalYtdActualHours = trackerItems.reduce((sum, item) => sum + item.ytdActualHours, 0);

  const activeTrackerItems = trackerItems.filter((item) => {
    const emp = employees.find((e) => e.empId === item.empId);
    return !emp || emp.status === 'Active';
  });

  const avgUtilizationRate = activeTrackerItems.length > 0
    ? activeTrackerItems.reduce((sum, item) => sum + item.utilizationRate, 0) / activeTrackerItems.length
    : 0;

  const highRiskCount = trackerItems.filter((item) => item.riskStatus === 'Overtime Risk').length;
  const idleCount = trackerItems.filter((item) => item.riskStatus === 'Capacity Idle').length;

  return {
    totalYtdGrossPay,
    totalContractHours,
    totalYtdActualHours,
    avgUtilizationRate,
    highRiskCount,
    idleCount,
  };
}

/**
 * Format Helpers
 */
export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
  if (isNaN(amount)) return `${currencySymbol}0.00`;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${currencySymbol}${formatted}` : `${currencySymbol}${formatted}`;
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0.0%';
  return `${(value * 100).toFixed(1)}%`;
}

export function formatHours(hours: number): string {
  if (isNaN(hours)) return '0.00 hrs';
  return `${hours.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} hrs`;
}

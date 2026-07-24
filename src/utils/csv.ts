import { Employee, DeptLogEntry } from '../types';

/**
 * CSV Parser Helper
 */
export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r\n|\n/);
  const rows: string[][] = [];

  for (let line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let insideQuotes = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());
    rows.push(cells);
  }

  return rows;
}

/**
 * Bulk Employee CSV Import Parser
 * Expected headers: Emp_ID, Emp_Name, Dept_ID, Dept_Name, Position, Base_Hourly_Rate, Annual_Contract_Hours, Status
 */
export function parseEmployeeCSV(csvText: string): Employee[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const employees: Employee[] = [];

  const empIdIdx = headers.findIndex((h) => h.includes('empid') || h.includes('id'));
  const nameIdx = headers.findIndex((h) => h.includes('empname') || h.includes('name'));
  const deptIdIdx = headers.findIndex((h) => h.includes('deptid') || h.includes('deptcode'));
  const deptNameIdx = headers.findIndex((h) => h.includes('deptname') || h.includes('dept'));
  const posIdx = headers.findIndex((h) => h.includes('position') || h.includes('role') || h.includes('job'));
  const rateIdx = headers.findIndex((h) => h.includes('hourlyrate') || h.includes('rate') || h.includes('base'));
  const contractIdx = headers.findIndex((h) => h.includes('contracthours') || h.includes('annualhours') || h.includes('hours'));
  const statusIdx = headers.findIndex((h) => h.includes('status') || h.includes('active'));

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const empId = empIdIdx !== -1 ? row[empIdIdx] : `EMP${100 + i}`;
    const empName = nameIdx !== -1 ? row[nameIdx] : `Employee ${i}`;
    const deptId = deptIdIdx !== -1 ? row[deptIdIdx] : 'D01';
    const deptName = deptNameIdx !== -1 ? row[deptNameIdx] : 'Executive & Operations';
    const position = posIdx !== -1 ? row[posIdx] : 'Staff';
    const baseHourlyRate = rateIdx !== -1 ? parseFloat(row[rateIdx].replace(/[^0-9.]/g, '')) || 30 : 30;
    const annualContractHours = contractIdx !== -1 ? parseFloat(row[contractIdx].replace(/[^0-9.]/g, '')) || 2080 : 2080;
    const rawStatus = statusIdx !== -1 ? row[statusIdx].toLowerCase() : 'active';
    const status = rawStatus.includes('inact') ? 'Inactive' : 'Active';

    if (empId && empName) {
      employees.push({
        empId,
        empName,
        deptId,
        deptName,
        position,
        baseHourlyRate,
        annualContractHours,
        status,
      });
    }
  }

  return employees;
}

/**
 * Bulk Dept Log Entry CSV Import Parser
 * Expected headers: Month, Emp_ID, Regular_Hours, OT_Hours, Allowances, Notes
 */
export function parseDeptLogCSV(csvText: string, defaultDeptId: string = 'dept_1'): DeptLogEntry[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const logs: DeptLogEntry[] = [];

  const monthIdx = headers.findIndex((h) => h.includes('month') || h.includes('date'));
  const empIdIdx = headers.findIndex((h) => h.includes('empid') || h.includes('emp'));
  const regIdx = headers.findIndex((h) => h.includes('regular') || h.includes('reghours'));
  const otIdx = headers.findIndex((h) => h.includes('ot') || h.includes('overtime'));
  const allowIdx = headers.findIndex((h) => h.includes('allowance') || h.includes('bonus') || h.includes('other'));
  const notesIdx = headers.findIndex((h) => h.includes('note') || h.includes('remark') || h.includes('comment'));

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const month = monthIdx !== -1 ? row[monthIdx] : '2026-01';
    const empId = empIdIdx !== -1 ? row[empIdIdx] : '';
    const regularHours = regIdx !== -1 ? parseFloat(row[regIdx].replace(/[^0-9.]/g, '')) || 0 : 160;
    const otHours = otIdx !== -1 ? parseFloat(row[otIdx].replace(/[^0-9.]/g, '')) || 0 : 0;
    const allowances = allowIdx !== -1 ? parseFloat(row[allowIdx].replace(/[^0-9.]/g, '')) || 0 : 0;
    const notes = notesIdx !== -1 ? row[notesIdx] : 'CSV Imported Log';

    if (empId) {
      logs.push({
        id: `csv-log-${Date.now()}-${i}`,
        deptId: defaultDeptId,
        month,
        empId,
        regularHours,
        otHours,
        allowances,
        notes,
      });
    }
  }

  return logs;
}

/**
 * Helper to generate CSV download string
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.join(',') + '\n';

  rows.forEach((row) => {
    const formattedRow = row.map((cell) => {
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    });
    csvContent += formattedRow.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

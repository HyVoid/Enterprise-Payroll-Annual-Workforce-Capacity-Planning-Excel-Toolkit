import React, { useState } from 'react';
import { Employee, SettingsConfig, EmployeeStatus } from '../types';
import { DEPARTMENTS } from '../data/defaultData';
import { calculateEmployee, formatCurrency, formatHours } from '../utils/calculations';
import { Users, Plus, Trash2, Search, Filter, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface EmployeeMasterViewProps {
  employees: Employee[];
  settings: SettingsConfig;
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
}

export const EmployeeMasterView: React.FC<EmployeeMasterViewProps> = ({
  employees,
  settings,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form state
  const [newEmp, setNewEmp] = useState<Employee>({
    empId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
    empName: '',
    deptId: 'D01',
    deptName: 'Executive & Operations',
    position: '',
    baseHourlyRate: 40.0,
    annualContractHours: 2080,
    status: 'Active',
  });

  // Calculate fields for each employee
  const calculatedEmployees = employees.map((emp) =>
    calculateEmployee(emp, employees, settings)
  );

  // Filter employees
  const filteredEmployees = calculatedEmployees.filter((emp) => {
    const matchesSearch =
      emp.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptFilter === 'ALL' || emp.deptId === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || emp.status === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDeptSelectForNew = (deptCode: string) => {
    const deptObj = DEPARTMENTS.find((d) => d.deptCode === deptCode);
    if (deptObj) {
      setNewEmp({
        ...newEmp,
        deptId: deptObj.deptCode,
        deptName: deptObj.name,
      });
    }
  };

  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.empId.trim() || !newEmp.empName.trim()) return;

    onAddEmployee(newEmp);
    setNewEmp({
      empId: `EMP${String(employees.length + 2).padStart(3, '0')}`,
      empName: '',
      deptId: 'D01',
      deptName: 'Executive & Operations',
      position: '',
      baseHourlyRate: 40.0,
      annualContractHours: 2080,
      status: 'Active',
    });
    setShowAddModal(false);
  };

  const handleRowFieldChange = (
    empId: string,
    field: keyof Employee,
    value: string | number
  ) => {
    const target = employees.find((e) => e.empId === empId);
    if (!target) return;

    let updated = { ...target, [field]: value };

    // If department changed, sync department name
    if (field === 'deptId') {
      const deptObj = DEPARTMENTS.find((d) => d.deptCode === value);
      if (deptObj) {
        updated.deptName = deptObj.name;
      }
    }

    onUpdateEmployee(updated);
  };

  return (
    <div className="space-y-6 page-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
            Employee Master Directory (Sheet 2: Employee_Master)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Central workforce truth source. Houses base hourly pay rates, annual contract hours, department mapping, and data integrity checks.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] rounded-lg flex items-center gap-1.5 shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Controls & Search Toolbar */}
      <div className="app-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#888888]" />
          <input
            type="text"
            placeholder="Search by ID, name, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#888888]">
            <Filter className="w-3.5 h-3.5 text-[#2251FF]" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md px-2.5 py-1.5 font-medium text-[#051C2C]"
          >
            <option value="ALL">All Departments (7)</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.deptCode}>
                {d.deptCode}: {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md px-2.5 py-1.5 font-medium text-[#051C2C]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Employee Directory Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                <th className="py-3 px-3 table-header-cell">Emp ID</th>
                <th className="py-3 px-3 table-header-cell">Full Name</th>
                <th className="py-3 px-3 table-header-cell">Department</th>
                <th className="py-3 px-3 table-header-cell">Position</th>
                <th className="py-3 px-3 table-header-cell text-right">Base Hourly Rate</th>
                <th className="py-3 px-3 table-header-cell text-right">Annual Contract Hours</th>
                <th className="py-3 px-3 table-header-cell text-right">Monthly Target Hours</th>
                <th className="py-3 px-3 table-header-cell text-center">Status</th>
                <th className="py-3 px-3 table-header-cell text-center">Data Check</th>
                <th className="py-3 px-3 table-header-cell text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#888888]">
                    No employees matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.empId} className="hover:bg-gray-50/70 transition-colors">
                    {/* Emp ID */}
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#051C2C]">
                      {emp.empId}
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={emp.empName}
                        onChange={(e) => handleRowFieldChange(emp.empId, 'empName', e.target.value)}
                        className="input-editable font-medium text-[#051C2C] w-full min-w-[120px]"
                      />
                    </td>

                    {/* Dept Select */}
                    <td className="py-2.5 px-3">
                      <select
                        value={emp.deptId}
                        onChange={(e) => handleRowFieldChange(emp.empId, 'deptId', e.target.value)}
                        className="input-editable text-xs font-medium text-[#051C2C] w-full"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.id} value={d.deptCode}>
                            {d.deptCode} - {d.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Position */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={emp.position}
                        onChange={(e) => handleRowFieldChange(emp.empId, 'position', e.target.value)}
                        className="input-editable text-[#051C2C] w-full min-w-[120px]"
                      />
                    </td>

                    {/* Base Hourly Rate (Editable Yellow Input) */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[#888888] font-mono">{settings.currency}</span>
                        <input
                          type="number"
                          step="0.5"
                          value={emp.baseHourlyRate}
                          onChange={(e) =>
                            handleRowFieldChange(
                              emp.empId,
                              'baseHourlyRate',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="input-editable font-mono text-right font-semibold text-[#2251FF] w-20"
                        />
                      </div>
                    </td>

                    {/* Annual Contract Hours */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        type="number"
                        step="10"
                        value={emp.annualContractHours}
                        onChange={(e) =>
                          handleRowFieldChange(
                            emp.empId,
                            'annualContractHours',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="input-editable font-mono text-right font-semibold text-[#051C2C] w-20"
                      />
                    </td>

                    {/* Monthly Target Hours (Formula Auto-Calculated) */}
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#051C2C]/80 bg-[#051C2C]/[0.02]">
                      {emp.monthlyTargetHours.toFixed(2)} hrs
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() =>
                          handleRowFieldChange(
                            emp.empId,
                            'status',
                            emp.status === 'Active' ? 'Inactive' : 'Active'
                          )
                        }
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          emp.status === 'Active'
                            ? 'bg-[#00C853]/10 text-[#00C853]'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {emp.status}
                      </button>
                    </td>

                    {/* Data Check Badge */}
                    <td className="py-2.5 px-3 text-center">
                      {emp.dataCheck === 'Duplicate ID' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D32F2F]/10 text-[#D32F2F]">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Duplicate ID</span>
                        </span>
                      ) : emp.dataCheck === 'Missing Info' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>Incomplete</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00C853]/10 text-[#00C853]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Valid</span>
                        </span>
                      )}
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onDeleteEmployee(emp.empId)}
                        className="p-1 text-[#888888] hover:text-[#D32F2F] hover:bg-red-50 rounded transition-colors"
                        title="Delete employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="app-card w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
              <h3 className="font-garamond text-xl font-bold text-[#051C2C]">
                Add New Employee to Master Sheet
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#888888] hover:text-[#051C2C] px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Emp ID *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.empId}
                    onChange={(e) => setNewEmp({ ...newEmp, empId: e.target.value })}
                    className="input-editable w-full font-mono font-semibold"
                    placeholder="EMP021"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.empName}
                    onChange={(e) => setNewEmp({ ...newEmp, empName: e.target.value })}
                    className="input-editable w-full font-medium"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Department *</label>
                  <select
                    value={newEmp.deptId}
                    onChange={(e) => handleDeptSelectForNew(e.target.value)}
                    className="input-editable w-full font-medium"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.deptCode}>
                        {d.deptCode}: {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Position / Role</label>
                  <input
                    type="text"
                    value={newEmp.position}
                    onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                    className="input-editable w-full"
                    placeholder="Senior Analyst"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">
                    Base Hourly Rate ({settings.currency})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newEmp.baseHourlyRate}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, baseHourlyRate: parseFloat(e.target.value) || 0 })
                    }
                    className="input-editable w-full font-mono font-semibold text-[#2251FF]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">
                    Annual Contract Hours
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={newEmp.annualContractHours}
                    onChange={(e) =>
                      setNewEmp({
                        ...newEmp,
                        annualContractHours: parseFloat(e.target.value) || 2080,
                      })
                    }
                    className="input-editable w-full font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E8E6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#888888] hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] rounded-md transition-colors"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

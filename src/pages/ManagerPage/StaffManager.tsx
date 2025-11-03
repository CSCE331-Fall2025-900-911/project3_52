import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api/http";
import { Staff } from "../../types/models";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

// --- Staff Form (co-located) ---
const StaffForm = ({
  staff,
  onSuccess,
  onCancel,
}: {
  staff: Staff | null;
  onSuccess: (updatedStaff: Staff) => void;
  onCancel: () => void;
}) => {
  // ... (Paste the exact code for StaffForm here) ...
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = staff !== null;

  useEffect(() => {
    if (isEditing) {
      setStaffId(staff.staff_id);
      setName(staff.name);
      setRole(staff.role);
      setSalary(String(staff.salary));
      setHoursWorked(String(staff.hours_worked));
      setEmail(staff.email);
    } else {
      setStaffId("");
      setName("");
      setRole("");
      setSalary("");
      setHoursWorked("");
      setEmail("");
    }
  }, [staff, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    const url = isEditing ? `/api/staff/${staff.staff_id}` : "/api/staff";
    const method = isEditing ? "PUT" : "POST";
    const payload = {
      staff_id: staffId,
      name: name,
      role: role,
      salary: parseFloat(salary),
      hours_worked: parseFloat(hoursWorked),
      email: email,
    };
    if (
      !payload.staff_id ||
      !payload.name ||
      !payload.role ||
      !payload.email ||
      isNaN(payload.salary) ||
      payload.salary <= 0 ||
      isNaN(payload.hours_worked) ||
      payload.hours_worked < 0
    ) {
      setFormError("Please fill out all fields with valid data.");
      setIsSubmitting(false);
      return;
    }
    if (isEditing) {
      // @ts-ignore
      delete payload.staff_id;
    }
    try {
      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save staff member.");
      }
      const savedStaff: Staff = await response.json();
      onSuccess(savedStaff);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Paste the full JSX for StaffForm) ... */}
      <div>
        <label
          htmlFor="staffId"
          className="block text-sm font-medium text-gray-700"
        >
          Staff ID (Username)
        </label>
        <input
          type="text"
          id="staffId"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
          required
          disabled={isEditing}
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Barista">Barista</option>
          <option value="Cook">Cook</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary (Annual)
          </label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
          />
        </div>
        <div>
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700"
          >
            Hours (Weekly)
          </label>
          <input
            type="number"
            id="hours"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="1"
          />
        </div>
      </div>
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
};

// --- Staff Manager (the main export) ---
export default function StaffManager() {
  // ... (Paste the exact code for StaffManager here) ...
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/staff");
      if (!response.ok) {
        throw new Error("Failed to fetch staff.");
      }
      const data: Staff[] = await response.json();
      setStaff(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const openAddModal = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staffMember: Staff) => {
    setCurrentStaff(staffMember);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStaff(null);
  };

  const handleSaveSuccess = (savedStaff: Staff) => {
    if (currentStaff) {
      setStaff(
        staff.map((s) => (s.staff_id === savedStaff.staff_id ? savedStaff : s))
      );
    } else {
      setStaff([...staff, savedStaff]);
    }
    closeModal();
  };

  const handleDelete = async (staffId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete staff member "${staffId}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const response = await apiFetch(`/api/staff/${staffId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete staff member.");
      }
      setStaff(staff.filter((s) => s.staff_id !== staffId));
      alert("Staff member deleted successfully.");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          {/* ... (Paste the full JSX for the table) ... */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Staff ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Salary
              </th>
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((staffMember) => (
              <tr key={staffMember.staff_id}>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {staffMember.staff_id}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {staffMember.name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staffMember.role === "Manager"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {staffMember.role}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {staffMember.email}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  ${(staffMember.salary ?? 0).toLocaleString()}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    onClick={() => openEditModal(staffMember)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember.staff_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Staff Management</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon"
        >
          + Add Employee
        </button>
      </div>
      {renderContent()}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentStaff ? "Edit Employee" : "Add New Employee"}
      >
        <StaffForm
          staff={currentStaff}
          onSuccess={handleSaveSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
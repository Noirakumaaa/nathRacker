import React, { useState } from "react";
import { useToastStore } from "lib/zustand/ToastStore";
import APIFETCH from "lib/axios/axiosConfig";
import { useNavigate } from "react-router";
import { labelCls, inputCls } from "component/styleConfig";
import { Opt, Req } from "component/LabelStyle";

interface CreateRegisterAccount {
  firstName: string;
  lastName: string;
  middleName: string;
  govUsername: string;
  email: string;
  password: string;
  phone: string;
  role: "ENCODER" | "ADMIN" | "";
  assignedOperationId: number | "";
  assignedLGUID: number | "";
  assignedBarangayId: number | "";
}

const EMPTY_FORM: CreateRegisterAccount = {
  firstName: "",
  lastName: "",
  middleName: "",
  govUsername: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  assignedOperationId: "",
  assignedLGUID: "",
  assignedBarangayId: "",
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const { show } = useToastStore();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateRegisterAccount>(EMPTY_FORM);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Don't uppercase email or password
    const noUppercase = ["email", "password", "govUsername"];
    const formatted = noUppercase.includes(name) ? value : value.toUpperCase();

    const numberFields = ["assignedOperationId", "assignedLGUID", "assignedBarangayId"];
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? (value === "" ? "" : Number(value)) : formatted,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      const res = await APIFETCH.post("/auth/register", formData);
      if (res.data?.success) {
        show(res.data.message ?? "Account created successfully.", "success");
        handleReset();
      } else {
        show(res.data?.message ?? "Registration failed.", "error");
      }
    } catch {
      show("An error occurred during registration.", "error");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    navigate(-1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          New Account Registration
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
            Required
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-(--color-muted) bg-(--color-subtle) border border-(--color-border) px-2 py-1 rounded-md uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-placeholder) inline-block shrink-0" />
            Optional
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1 — Personal Info */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Personal Information
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="firstName" className={labelCls}>
                  First Name <Req />
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                  placeholder="Enter First Name"
                />
              </div>
              <div>
                <label htmlFor="middleName" className={labelCls}>
                  Middle Name <Opt />
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className={inputCls}
                  placeholder="Enter Middle Name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className={labelCls}>
                  Last Name <Req />
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                  placeholder="Enter Last Name"
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>
                  Phone Number <Req />
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                  placeholder="e.g. 09XXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Column 2 — Account Credentials */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Account Credentials
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="govUsername" className={labelCls}>
                  Government Username <Req />
                </label>
                <input
                  type="text"
                  id="govUsername"
                  name="govUsername"
                  value={formData.govUsername}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                  placeholder="Enter Gov Username"
                />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>
                  Email Address <Req />
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label htmlFor="password" className={labelCls}>
                  Password <Req />
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={inputCls + " pr-10"}
                    placeholder="Enter Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-ink) transition-colors text-[11px] font-medium uppercase tracking-wide"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 — Role & Assignment */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Role & Assignment
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="role" className={labelCls}>
                  Role <Req />
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                >
                  <option value="">Select Role</option>
                  <option value="ENCODER">ENCODER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label htmlFor="assignedOperationId" className={labelCls}>
                  Assigned Operation ID <Opt />
                </label>
                <input
                  type="number"
                  id="assignedOperationId"
                  name="assignedOperationId"
                  value={formData.assignedOperationId}
                  onChange={handleInputChange}
                  min={1}
                  className={inputCls}
                  placeholder="Enter Operation ID"
                />
              </div>
              <div>
                <label htmlFor="assignedLGUID" className={labelCls}>
                  Assigned LGU ID <Opt />
                </label>
                <input
                  type="number"
                  id="assignedLGUID"
                  name="assignedLGUID"
                  value={formData.assignedLGUID}
                  onChange={handleInputChange}
                  min={1}
                  className={inputCls}
                  placeholder="Enter LGU ID"
                />
              </div>
              <div>
                <label htmlFor="assignedBarangayId" className={labelCls}>
                  Assigned Barangay ID <Opt />
                </label>
                <input
                  type="number"
                  id="assignedBarangayId"
                  name="assignedBarangayId"
                  value={formData.assignedBarangayId}
                  onChange={handleInputChange}
                  min={1}
                  className={inputCls}
                  placeholder="Enter Barangay ID"
                />
              </div>

              {/* Role hint card */}
              <div className="rounded-lg border border-(--color-border) bg-[#f8f8f4] p-3 mt-1">
                <p className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider mb-1.5">
                  Role Reference
                </p>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--color-ink) shrink-0" />
                    <p className="text-[11px] text-(--color-ink)">
                      <span className="font-semibold">ENCODER</span> — Can input and manage records
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-(--color-ink) shrink-0" />
                    <p className="text-[11px] text-(--color-ink)">
                      <span className="font-semibold">ADMIN</span> — Full system access
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={buttonLoading}
                  className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {buttonLoading ? "Creating…" : "Create Account →"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={buttonLoading}
                  className="flex-1 h-10 bg-transparent text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
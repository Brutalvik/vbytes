"use client";

import React, { useState } from "react";

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface CustomerFormModalProps {
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, "id"> | Customer) => void | Promise<void>;
  show: boolean;
}

const modalOverlayClass =
  "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
const modalContentClass =
  "bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300";
const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonClass = "px-4 py-2 rounded-md transition-colors duration-200";

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  customer,
  onClose,
  onSubmit,
  show,
}) => {
  const [formData, setFormData] = useState<Omit<Customer, "id"> | Customer>(
    customer || { name: "", email: "", phone: "", address: "", notes: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className={modalOverlayClass}>
      <div className={`${modalContentClass} scale-100 opacity-100`}>
        <h2 className="text-2xl font-semibold mb-4">
          {customer ? "Edit Customer" : "Add New Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`${buttonClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
            >
              {customer ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;

"use client";

import React, { useState, useEffect } from "react";

interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  status: "Available" | "Sold" | "Pending";
  imageUrl: string;
}

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Sale {
  id?: string;
  carId: string;
  customerId: string;
  saleDate: string;
  salePrice: number;
  salespersonId: string;
}

interface SaleFormModalProps {
  sale?: Sale | null;
  onClose: () => void;
  onSubmit: (sale: Omit<Sale, "id"> | Sale) => void;
  cars: Car[];
  customers: Customer[];
  userId: string | null;
  show: boolean;
}

const modalOverlayClass =
  "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
const modalContentClass =
  "bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300";
const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonClass = "px-4 py-2 rounded-md transition-colors duration-200";

const SaleFormModal: React.FC<SaleFormModalProps> = ({
  sale,
  onClose,
  onSubmit,
  cars,
  customers,
  userId,
  show,
}) => {
  const [formData, setFormData] = useState<Omit<Sale, "id"> | Sale>(
    sale || {
      carId: "",
      customerId: "",
      saleDate: new Date().toISOString().split("T")[0],
      salePrice: 0,
      salespersonId: userId || "",
    }
  );

  useEffect(() => {
    if (!sale) {
      setFormData((prev) => ({
        ...prev,
        carId: cars.find((c) => c.status === "Available")?.id || "",
        customerId: customers[0]?.id || "",
        salespersonId: userId || "",
      }));
    }
  }, [cars, customers, userId, sale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salePrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  const availableCars = cars.filter(
    (c) => c.status === "Available" || (sale && c.id === sale.carId)
  );

  return (
    <div className={modalOverlayClass}>
      <div className={`${modalContentClass} scale-100 opacity-100`}>
        <h2 className="text-2xl font-semibold mb-4">{sale ? "Edit Sale" : "Add New Sale"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="carId" className="block text-sm font-medium text-gray-700">
              Car
            </label>
            <select
              id="carId"
              name="carId"
              value={formData.carId}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a Car</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.vin}) - ${car.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700">
              Sale Date
            </label>
            <input
              type="date"
              id="saleDate"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
              Sale Price
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice === 0 ? "" : formData.salePrice}
              onChange={handleChange}
              className={inputClass}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="salespersonId" className="block text-sm font-medium text-gray-700">
              Salesperson ID
            </label>
            <input
              type="text"
              id="salespersonId"
              name="salespersonId"
              value={formData.salespersonId}
              onChange={handleChange}
              className={inputClass}
              readOnly
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
              {sale ? "Update Sale" : "Add Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleFormModal;

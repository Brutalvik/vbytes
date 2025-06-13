"use client";

import React, { useEffect, useState } from "react";
import { Customer } from "@crm/sections/CustomerSection";

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
interface CarFormModalProps {
  car?: Car | null;
  onClose: () => void;
  onSubmit: (car: Omit<Car, "id"> | Car) => void;
  show: boolean;
}

const modalOverlayClass =
  "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
const modalContentClass =
  "bg-white p-6 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300";
const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonClass = "px-4 py-2 rounded-md transition-colors duration-200";

const CarFormModal: React.FC<CarFormModalProps> = ({ car, onClose, onSubmit, show }) => {
  const [formData, setFormData] = useState<Omit<Car, "id"> | Car>(
    car || {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      vin: "",
      status: "Available",
      imageUrl: "https://placehold.co/400x200/cccccc/333333?text=Car+Image",
    }
  );

  useEffect(() => {
    if (show && car) {
      setFormData(car);
    } else if (show && !car) {
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        vin: "",
        status: "Available",
        imageUrl: "https://placehold.co/400x200/cccccc/333333?text=Car+Image",
      });
    }
  }, [car, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      imageUrl:
        formData.imageUrl?.trim() || "https://placehold.co/400x200/cccccc/333333?text=Car+Image",
    });
  };

  if (!show) return null;

  return (
    <div className={modalOverlayClass}>
      <div className={`${modalContentClass} scale-100 opacity-100`}>
        <h2 className="text-2xl font-semibold mb-4">{car ? "Edit Car" : "Add New Car"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={inputClass}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
              VIN
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={17}
              minLength={17}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={inputClass}
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
              {car ? "Update Car" : "Add Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal;

"use client";

import React from "react";
import { Car, InventorySectionProps } from "@crm/lib/types";
import { exportToCSV } from "@crm/lib/exportToCSV";

const InventorySection: React.FC<InventorySectionProps> = ({ cars, onAdd, onEdit, onDelete }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Car Inventory</h2>
        <div className="flex justify-end gap-x-4">
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Add New Car</span>
          </button>

          <button
            onClick={() => exportToCSV(cars, "inventory")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 11-2 0V4H5v12h4a1 1 0 110 2H4a1 1 0 01-1-1V3zm14.707 9.707a1 1 0 00-1.414-1.414L13 14.586V10a1 1 0 10-2 0v4.586l-3.293-3.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Export Inventory CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No cars in inventory. Add one!
          </p>
        ) : (
          cars.map((car) => <CarCard key={car.id} car={car} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
};

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img
        src={car.imageUrl}
        alt={`${car.make} ${car.model}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/400x200/cccccc/333333?text=${car.make}+${car.model}`;
        }}
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-gray-700 mb-1">
          Price: <span className="font-semibold text-blue-600">${car.price.toLocaleString()}</span>
        </p>
        <p className="text-gray-700 mb-1">
          VIN: <span className="font-mono text-sm">{car.vin}</span>
        </p>
        <p className="text-gray-700 mb-3">
          Status:
          <span
            className={`font-semibold ml-2 px-2 py-1 rounded-full text-sm ${
              car.status === "Available"
                ? "bg-green-100 text-green-800"
                : car.status === "Sold"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {car.status}
          </span>
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => onEdit(car)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => car.id && onDelete(car.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;

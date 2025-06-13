"use client";

import React from "react";

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

interface InventorySectionProps {
  cars: Car[];
  onAdd: () => void;
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({ cars, onAdd, onEdit, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Car Inventory</h2>
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

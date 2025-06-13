"use client";

import React from "react";
import CSVExportButton from "@crm/components/CSVExportButton";
import { formatFirestoreTimestamp } from "@crm/lib/utils";

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

export interface Sale {
  id?: string;
  carId: string;
  customerId: string;
  saleDate: string;
  salePrice: number;
  salespersonId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SaleSectionProps {
  sales: Sale[];
  cars: Car[];
  customers: Customer[];
  onAdd: () => void;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
}

const SaleSection: React.FC<SaleSectionProps> = ({
  sales,
  cars,
  customers,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const getCarDetails = (carId: string) => cars.find((c) => c.id === carId);
  const getCustomerDetails = (customerId: string) => customers.find((c) => c.id === customerId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sales Records</h2>
        <div className="flex gap-4">
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

            <span>Record New Sale</span>
          </button>
          <CSVExportButton
            data={sales}
            filename="sales"
            label="Export Sales CSV"
            timestampField="saleDate"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salesperson ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const car = getCarDetails(sale.carId);
                const customer = getCustomerDetails(sale.customerId);
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.saleDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {car ? `${car.year} ${car.make} ${car.model}` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {customer ? customer.name : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${sale.salePrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-xs break-all text-gray-700">
                      {sale.salespersonId}
                    </td>
                    <td>{formatFirestoreTimestamp(sale.createdAt)}</td>
                    <td>{formatFirestoreTimestamp(sale.updatedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => onEdit(sale)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => sale.id && onDelete(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleSection;

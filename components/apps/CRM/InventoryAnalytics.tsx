"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

interface InventoryAnalyticsProps {
  cars: Car[];
}

const statusColors: Record<Car["status"], string> = {
  Available: "#4ade80", // green
  Sold: "#f87171", // red
  Pending: "#facc15", // yellow
};

const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({ cars }) => {
  const { carsByStatus, carsByYear, valueByStatus } = useMemo(() => {
    const statusMap: Record<string, number> = {};
    const yearMap: Record<number, number> = {};
    const valueMap: Record<string, number> = {};

    for (const car of cars) {
      // Status count
      statusMap[car.status] = (statusMap[car.status] || 0) + 1;

      // Cars by Year
      yearMap[car.year] = (yearMap[car.year] || 0) + 1;

      // Value by Status
      valueMap[car.status] = (valueMap[car.status] || 0) + car.price;
    }

    return {
      carsByStatus: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      carsByYear: Object.entries(yearMap)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year),
      valueByStatus: Object.entries(valueMap).map(([status, value]) => ({
        status,
        value,
      })),
    };
  }, [cars]);

  return (
    <div className="mt-10 space-y-10">
      <h2 className="text-2xl font-bold text-gray-800">📊 Inventory Analytics</h2>

      {/* Cars by Status */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Cars by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={carsByStatus}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count">
              {carsByStatus.map((entry, index) => (
                <Cell key={index} fill={statusColors[entry.status as Car["status"]]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cars by Year */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Cars by Year</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={carsByYear}>
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value by Status */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Value by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={valueByStatus}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {valueByStatus.map((entry, index) => (
                <Cell key={index} fill={statusColors[entry.status as Car["status"]]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryAnalytics;

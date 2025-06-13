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
  LineChart,
  Line,
} from "recharts";
import { Car, InventoryAnalyticsProps } from "@crm/lib/types";

const statusColors: Record<Car["status"], string> = {
  Available: "#4ade80",
  Sold: "#f87171",
  Pending: "#facc15",
};

const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({ cars }) => {
  const { carsByStatus, carsByYear, valueByStatus, carsByMonth } = useMemo(() => {
    const statusMap: Record<string, number> = {};
    const yearMap: Record<number, number> = {};
    const valueMap: Record<string, number> = {};

    for (const car of cars) {
      statusMap[car.status] = (statusMap[car.status] || 0) + 1;
      yearMap[car.year] = (yearMap[car.year] || 0) + 1;
      valueMap[car.status] = (valueMap[car.status] || 0) + car.price;
    }

    const carsByMonth = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setDate(1);
      month.setMonth(month.getMonth() - (11 - i));

      const label = month.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      const count = cars.filter((car) => {
        if (!car.createdAt) return false;
        const created =
          typeof car.createdAt === "string"
            ? new Date(car.createdAt)
            : new Date(car.createdAt.seconds * 1000);

        return (
          created.getMonth() === month.getMonth() && created.getFullYear() === month.getFullYear()
        );
      }).length;

      return { month: label, count };
    });

    return {
      carsByStatus: Object.entries(statusMap).map(([status, count]) => ({
        status,
        count,
      })),
      carsByYear: Object.entries(yearMap)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year),
      valueByStatus: Object.entries(valueMap).map(([status, value]) => ({
        status,
        value,
      })),
      carsByMonth,
    };
  }, [cars]);

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">📊 Inventory Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cars by Status */}
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cars by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
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
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cars by Year</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={carsByYear}>
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Total Value by Status */}
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={valueByStatus}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
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

        {/* Cars Added by Month */}
        <div className="bg-white p-4 rounded-lg shadow min-w-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cars Added by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={carsByMonth}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;

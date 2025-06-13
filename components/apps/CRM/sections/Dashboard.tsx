"use client";

import React from "react";

interface DashboardProps {
  stats: {
    totalCars: number;
    availableCars: number;
    soldCars: number;
    totalCustomers: number;
    totalSales: number;
    totalRevenue: number;
    averageSalePrice: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const statCardClass =
    "bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300";
  const statValueClass = "text-4xl font-bold text-blue-600 mb-2";
  const statLabelClass = "text-xl text-gray-600";

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalCars}</div>
        <div className={statLabelClass}>Total Cars</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.availableCars}</div>
        <div className={statLabelClass}>Available Cars</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.soldCars}</div>
        <div className={statLabelClass}>Cars Sold</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalCustomers}</div>
        <div className={statLabelClass}>Total Customers</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{stats.totalSales}</div>
        <div className={statLabelClass}>Total Sales</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{formatCurrency(stats.totalRevenue)}</div>
        <div className={statLabelClass}>Total Revenue</div>
      </div>
      <div className={statCardClass}>
        <div className={statValueClass}>{formatCurrency(stats.averageSalePrice)}</div>
        <div className={statLabelClass}>Avg. Sale Price</div>
      </div>
    </div>
  );
};

export default Dashboard;

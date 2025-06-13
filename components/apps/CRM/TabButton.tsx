"use client";

import React from "react";

export type TabType = "dashboard" | "inventory" | "customers" | "sales" | "analytics";

export interface TabButtonProps {
  label: string;
  tab: TabType;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, tab, activeTab, setActiveTab }) => {
  const isActive = activeTab === tab;
  return (
    <button
      className={`px-6 py-3 text-lg font-medium transition-colors duration-200 ease-in-out
        ${
          isActive
            ? "text-blue-700 border-b-4 border-blue-700 bg-blue-50/50"
            : "text-gray-600 hover:text-blue-700 hover:bg-gray-100"
        }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );
};

export default TabButton;

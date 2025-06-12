"use client";

import React, { useState } from "react";
import classNames from "classnames";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  PackageCheck,
  PanelsTopLeft,
  Plus,
  BarChart3,
  Users,
  LayoutGrid,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

const sidebarItems = [
  { label: "Home", icon: <FaHome />, path: "/" },
  {
    label: "Apps",
    icon: <PackageCheck />,
    submenu: [
      {
        label: "Momentum",
        icon: <BarChart3 />,
        path: "/projects/momentum",
        submenu: [
          {
            label: "User Stats",
            icon: <Users />,
            path: "/apps/analytics/users",
          },
          {
            label: "System Health",
            icon: <Activity />,
            path: "/apps/analytics/health",
          },
        ],
      },
      { label: "CRM", icon: <LayoutGrid />, path: "/apps/crm" },
    ],
  },
  { label: "Add Product", icon: <Plus />, path: "/seller/upload" },
];

export default function CollapsibleSidebar({
  onToggle,
}: {
  onToggle?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNested, setOpenNested] = useState<string | null>(null);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onToggle) onToggle(next);
  };

  const handleSubmenuToggle = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
    setOpenNested(null);
  };

  const handleNestedToggle = (label: string) => {
    setOpenNested((prev) => (prev === label ? null : label));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (openSubmenu && path === "/") return false;
    return pathname === path;
  };

  return (
    <aside
      className={classNames(
        "z-20 relative h-screen bg-white/10 text-default-500 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 shadow-lg rounded-xl border border-white/20",
        collapsed ? "w-[60px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!collapsed && <span className="text-white font-semibold text-lg">Overview</span>}

        <button
          className="bg-white text-[#151A2D] p-1.5 rounded hover:bg-gray-200"
          onClick={toggleCollapsed}
        >
          {collapsed ? <Menu size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <ul className="flex flex-col gap-1 px-2">
        {sidebarItems.map((item) => {
          const hasSubmenu = !!item.submenu;
          const active = isActive(item.path);
          const submenuOpen = openSubmenu === item.label;

          return (
            <li key={item.label} className="relative">
              <div
                className={classNames(
                  "flex items-center justify-between px-4 py-2 rounded-md transition-colors cursor-pointer",
                  active || submenuOpen
                    ? "bg-blue-500 text-white font-semibold"
                    : "hover:bg-white hover:text-[#151A2D]"
                )}
                onClick={(e) => {
                  if (hasSubmenu) {
                    e.preventDefault();
                    handleSubmenuToggle(item.label);
                  } else if (item.path) {
                    router.push(item.path);
                    setOpenSubmenu(null);
                    setOpenNested(null);
                  }
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className="text-[20px]">{item.icon}</span>
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </div>
                {!collapsed && hasSubmenu && (
                  <span className="ml-auto">
                    {submenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                )}
              </div>

              {/* Expanded submenu for expanded view */}
              {!collapsed && hasSubmenu && submenuOpen && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((sub) => (
                    <li key={sub.label}>
                      <div
                        className={classNames(
                          "flex items-center justify-between px-2 py-1 rounded-md transition-colors",
                          isActive(sub.path) || openNested === sub.label
                            ? "bg-blue-500 text-white font-medium"
                            : "hover:bg-white/20 hover:text-white"
                        )}
                      >
                        <Link
                          href={sub.path || "#"}
                          className="flex items-center gap-3 w-full text-sm"
                          onClick={(e) => {
                            if (sub.submenu) {
                              e.preventDefault();
                              handleNestedToggle(sub.label);
                            } else {
                              setOpenSubmenu(null);
                              setOpenNested(null);
                            }
                          }}
                        >
                          <span>{sub.icon}</span>
                          <span>{sub.label}</span>
                        </Link>
                        {sub.submenu && (
                          <button onClick={() => handleNestedToggle(sub.label)}>
                            {openNested === sub.label ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Nested submenu */}
                      {sub.submenu && openNested === sub.label && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {sub.submenu.map((nested) => (
                            <li key={nested.label}>
                              <Link
                                href={nested.path}
                                onClick={() => {
                                  setOpenSubmenu(null);
                                  setOpenNested(null);
                                }}
                                className={classNames(
                                  "flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors",
                                  isActive(nested.path)
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "hover:bg-white/20 hover:text-white"
                                )}
                              >
                                <span>{nested.icon}</span>
                                <span>{nested.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Flyout submenu for collapsed view */}
              {collapsed && hasSubmenu && submenuOpen && (
                <div className="absolute left-full top-0 ml-2 w-48 bg-white text-black rounded shadow-lg py-2 z-30">
                  {item.submenu.map((sub) => (
                    <div key={sub.label} className="px-4 py-1 hover:bg-gray-100">
                      <Link
                        href={sub.path || "#"}
                        className="flex items-center gap-2 text-sm"
                        onClick={() => {
                          setOpenSubmenu(null);
                          setOpenNested(null);
                        }}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

"use client";

import { useState, useRef } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import LanguageDropdown from "@components/language-dropdown";
import { AnimatedMenu } from "@components/ui/animated-menu";
import { ChevronDown, ChevronUp } from "lucide-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuRef = useRef<HTMLUListElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuItemClick = () => setIsMenuOpen(false);
  const toggleMobileSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenSubmenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenSubmenu(null), 150);
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Desktop Menu */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <li
              key={item.label}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <NextLink
                  href={item.href}
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium text-base"
                  )}
                >
                  <AnimatedMenu item={item.label} className="text-base" />
                </NextLink>
                {item.submenu && (
                  <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-primary transition" />
                )}
              </div>
              {item.submenu && openSubmenu === item.label && (
                <ul
                  ref={submenuRef}
                  className={clsx(
                    // Width: Adjust min-w to change submenu width
                    "absolute top-full left-0 mt-2 z-50 min-w-[160px] py-2 px-3 -translate-x-6",
                    // Opacity: Adjust bg-black/50 for transparency
                    "bg-black/50 backdrop-blur-md rounded-xl shadow-xl border border-white/10",
                    "animate-fadeIn transition-all duration-300 ease-out space-y-2 text-left"
                  )}
                >
                  {item.submenu.map((sub) => (
                    <li key={sub.href} className="cursor-pointer">
                      <NextLink
                        href={sub.href}
                        className="block text-neutral-200 hover:text-primary text-sm transition-colors duration-300 text-left"
                      >
                        <AnimatedMenu item={sub.label} className="text-sm font-medium" />
                      </NextLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </NavbarContent>

      {/* Right Side - Desktop */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden lg:flex">
          <LanguageDropdown />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Toggle */}
      <NavbarMenuToggle className="lg:hidden z-10" />

      {/* Mobile Menu */}
      <NavbarMenu
        className={clsx(
          "fixed top-0 right-0 z-10 h-screen w-full",
          "backdrop-blur-xl bg-white/30 dark:bg-black/30",
          "p-6 overflow-hidden"
        )}
      >
        <div className="flex flex-col items-end gap-6 mt-16">
          <LanguageDropdown />
          <ul className="flex flex-col items-end gap-4 px-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`} className="w-full text-end">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className="flex justify-between items-center text-lg font-semibold text-foreground cursor-pointer"
                    >
                      <AnimatedMenu item={item.label} className="text-lg " />
                      {openSubmenu === item.label ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    {openSubmenu === item.label && (
                      <ul className="pl-4 pr-2 pt-2 space-y-2">
                        {item.submenu.map((sub) => (
                          <li key={sub.href} className="text-end cursor-pointer">
                            <Link
                              href={sub.href}
                              onClick={handleMenuItemClick}
                              className="text-base font-medium text-neutral-800 dark:text-neutral-200 hover:text-primary text-right"
                            >
                              <AnimatedMenu item={sub.label} className="text-sm" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    size="sm"
                    onClick={handleMenuItemClick}
                    className={clsx(
                      "text-lg font-semibold cursor-pointer",
                      index === 2
                        ? "text-primary"
                        : index === siteConfig.navMenuItems.length - 1
                          ? "text-danger"
                          : "text-foreground"
                    )}
                  >
                    <AnimatedMenu item={item.label} className="text-sm" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

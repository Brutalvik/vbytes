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
import { ThemeSwitch } from "@/components/theme-switch";

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
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={clsx(
        "fixed top-0 left-0 w-full z-10", // 👈 reduce z-index to z-10
        "border-b border-white/10",
        "bg-white/80 dark:bg-black/60 backdrop-blur-md backdrop-saturate-150",
        "transition-all duration-300"
      )}
    >
      {/* Desktop Menu */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {" "}
      </NavbarContent>

      {/* Right Side - Desktop */}
      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className=" lg:flex">
          <LanguageDropdown />
        </NavbarItem>
        <NavbarItem className=" lg:flex">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};

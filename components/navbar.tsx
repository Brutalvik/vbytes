"use client";

import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import LanguageDropdown from "@/components/LanguageDropdown";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ track mobile menu open/close

  const handleMenuItemClick = () => {
    setIsMenuOpen(false); // ✅ close menu when item is clicked
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left content: brand and nav items */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right content */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex">
          <LanguageDropdown />
        </NavbarItem>
        {/* <NavbarItem className="hidden md:flex">
          <ThemeSwitch />
        </NavbarItem> */}
      </NavbarContent>

      {/* Mobile toggle icon */}
      <NavbarMenuToggle className="lg:hidden z-10" />
      <NavbarMenu
        className={clsx(
          "fixed top-0 right-0 z-9 h-screen w-full", // ✅ Fullscreen
          "backdrop-blur-xl bg-white/30 dark:bg-black/30", // ✅ Glass effect
          "p-6 overflow-hidden" // ✅ Prevents scroll bar
        )}
      >
        <div className="flex flex-col items-end gap-6 mt-16">
          {" "}
          <LanguageDropdown />
          {/* Add top margin to avoid overlap with hamburger */}
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
                onClick={handleMenuItemClick}
                className="text-lg font-semibold"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

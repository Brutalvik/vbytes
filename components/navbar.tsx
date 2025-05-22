"use client";

import { useState } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import LanguageDropdown from "@/components/language-dropdown";
import { AnimatedMenu } from "@components/ui/animated-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuItemClick = () => setIsMenuOpen(false);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left Content (Desktop Menu) */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                href={item.href}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium text-base",
                )}
              >
                <AnimatedMenu item={item.label} className="text-base" />
              </NextLink>
            </li>
          ))}
        </ul>
      </NavbarContent>

      {/* Right Content (Desktop) */}
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

      {/* Mobile Toggle */}
      <NavbarMenuToggle className="lg:hidden z-10" />

      {/* Mobile Menu */}
      <NavbarMenu
        className={clsx(
          "fixed top-0 right-0 z-10 h-screen w-full",
          "backdrop-blur-xl bg-white/30 dark:bg-black/30",
          "p-6 overflow-hidden",
        )}
      >
        <div className="flex flex-col items-end gap-6 mt-16">
          <LanguageDropdown />
          <ul className="flex flex-col items-end gap-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  href={item.href}
                  size="sm"
                  onClick={handleMenuItemClick}
                  className={clsx(
                    "text-lg font-semibold",
                    index === 2
                      ? "text-primary"
                      : index === siteConfig.navMenuItems.length - 1
                        ? "text-danger"
                        : "text-foreground",
                  )}
                >
                  <AnimatedMenu item={item.label} className="text-lg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

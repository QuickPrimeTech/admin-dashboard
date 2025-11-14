import { Metadata } from "next";
import { MenuPageContent } from "@/sections/menu/menu-page-content";

export const metadata: Metadata = {
  title: "Menu Management",
  description:
    "Create, update, and organize your restaurant’s menu items effortlessly using the menu management dashboard.",
};

export default function MenuManagement() {
  return <MenuPageContent />;
}

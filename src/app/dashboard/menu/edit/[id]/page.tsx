import { EditMenuItemProvider } from "@/contexts/menu/edit-menu-item";
import { FormContent } from "@/sections/menu/edit/form-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Menu Item",
  description:
    "Add a new menu item with images, choices, and availability. Customize your restaurant’s offerings easily from your dashboard.",
};

type EditMenuPageProps = { id: string };

export default async function EditMenuPage({
  params,
}: {
  params: Promise<EditMenuPageProps>;
}) {
  const { id } = await params;

  return (
    <div>
      Welcome to the update page. You are about to edit and the string form {id}
      <EditMenuItemProvider>
        <FormContent />
      </EditMenuItemProvider>
    </div>
  );
}

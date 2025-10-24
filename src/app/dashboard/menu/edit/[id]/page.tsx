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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Edit Menu Item
            </h1>
            <p className="text-muted-foreground">
              Edit this menu dish with customizable options for your restaurant
            </p>
          </div>
        </div>
        <EditMenuItemProvider id={Number(id)}>
          <FormContent />
        </EditMenuItemProvider>
      </div>
    </div>
  );
}

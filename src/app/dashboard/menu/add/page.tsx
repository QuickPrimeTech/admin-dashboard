import { AddMenuItemProvider } from "@/contexts/add-menu-item";
import { FormContent } from "@/sections/menu/add/form-content";

export default function AddMenuItemPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Add Menu Item
          </h1>
          <p className="text-muted-foreground">
            Create a new dish with customizable options for your restaurant
          </p>
        </div>
        <AddMenuItemProvider>
          <FormContent />
        </AddMenuItemProvider>
      </div>
    </div>
  );
}

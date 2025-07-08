import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FAQEmptyStateProps } from "@/types/faqs";

export function FAQEmptyState({ setIsDialogOpen }: FAQEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first FAQ
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

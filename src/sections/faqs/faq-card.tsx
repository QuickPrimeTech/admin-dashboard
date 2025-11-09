import { Card, CardTitle, CardDescription, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { GripVertical, Trash2, Edit } from "lucide-react";
import { FAQ } from "@/types/faqs";

type FAQCardProps = {
  faq: FAQ;
  handleEdit: (faq: FAQ) => void;
  confirmDelete: (faq: FAQ) => void;
  togglePublished: (id: number, is_published: boolean) => void;
};

export function FAQCard({
  faq,
  handleEdit,
  confirmDelete,
  togglePublished,
}: FAQCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
          <div className="flex items-center gap-2">
            <Button
              variant={faq.is_published ? "default" : "outline"}
              size="sm"
              className="cursor-pointer"
              onClick={() => togglePublished(faq.id, faq.is_published)}
            >
              {faq.is_published ? "Published" : "Draft"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => handleEdit(faq)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => confirmDelete(faq)}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <CardTitle className="text-lg">{faq.question}</CardTitle>
            <CardDescription className="mt-2">{faq.answer}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

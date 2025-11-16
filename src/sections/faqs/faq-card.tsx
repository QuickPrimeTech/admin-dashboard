import { Card, CardTitle, CardDescription, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { GripVertical, Trash2, Edit } from "lucide-react";
import { Switch } from "@ui/switch";
import { FAQ } from "@/types/faqs";
import { useUpdateFaqMutation } from "@/hooks/use-faqs";
import { useBranch } from "@/components/providers/branch-provider";

type FAQCardProps = {
  faq: FAQ;
  handleEdit: (faq: FAQ) => void;
  confirmDelete: (faq: FAQ) => void;
};

export function FAQCard({ faq, handleEdit, confirmDelete }: FAQCardProps) {
  //Get the branchId from the context
  const { branchId } = useBranch();
  //Update Mutation
  const updateMutation = useUpdateFaqMutation();

  const togglePublished = (is_published: boolean) => {
    const payload = { ...faq, is_published };
    updateMutation.mutate({ faq: payload, branchId });
  };
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />

          <div className="flex items-center gap-4">
            {/* Published Switch */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {faq.is_published ? "Published" : "Draft"}
              </span>
              <Switch
                checked={faq.is_published}
                onCheckedChange={(value) => togglePublished(value)}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(faq)}
              className="cursor-pointer"
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

        <div className="flex items-start gap-3 flex-1 mt-3">
          <div className="flex-1">
            <CardTitle className="text-lg">{faq.question}</CardTitle>
            <CardDescription className="mt-2">{faq.answer}</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

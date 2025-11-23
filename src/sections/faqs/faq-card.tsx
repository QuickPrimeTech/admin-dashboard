import { Card, CardTitle, CardDescription, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { GripVertical, Trash2, Edit } from "lucide-react";
import { Switch } from "@ui/switch";
import { FAQ } from "@/types/faqs";
import { useDeleteFaqMutation, useUpdateFaqMutation } from "@/hooks/use-faqs";
import { useBranch } from "@/components/providers/branch-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";

type FAQCardProps = {
  faq: FAQ;
  handleEdit: (faq: FAQ) => void;
};

export function FAQCard({ faq, handleEdit }: FAQCardProps) {
  //Get the branchId from the context
  const { branchId } = useBranch();

  //Update Mutation
  const updateMutation = useUpdateFaqMutation();

  //Delete Mutation
  const deleteMutation = useDeleteFaqMutation();

  //Function to toggle published
  const togglePublished = (is_published: boolean) => {
    updateMutation.mutate({
      faq: { ...faq, is_published },
      branchId,
      id: faq.id,
    });
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer text-destructive hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this FAQ. This action{" "}
                    <span className="font-bold text-destructive">
                      cannot be undone
                    </span>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      deleteMutation.mutate({ id: faq.id, branchId })
                    }
                    variant="destructive"
                  >
                    <Trash2 />
                    Delete FAQ
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

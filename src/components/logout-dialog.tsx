// @/components/logout-dialog.tsx

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";

interface LogOutDialogProps {
  open: boolean;
}

export function LogOutDialog({ open }: LogOutDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[90vw] md:w-[40vw] lg:w-[30vw] aspect-3/2 flex flex-col items-center justify-center gap-4 text-center border-border shadow-lg"
        showCloseButton={false}
      >
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <div>
          <DialogTitle className="text-lg font-medium">
            Signing you out...
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait a moment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

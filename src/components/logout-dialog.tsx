// @/components/logout-dialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui/dialog";
import { Spinner } from "@ui/spinner";

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
        <Spinner className="h-10 w-10 text-primary" />
        <div>
          <DialogTitle className="text-lg font-medium">
            Signing you out...
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Please wait a moment
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { CheckCircle2, Loader2 } from "lucide-react";
import type { IconValue } from "../types";
import { Button } from "./Button";

export interface IconPickerFooterProps {
  onClose: () => void;
  handleApply: () => void;
  stagedIcon: IconValue | null;
  applying: boolean;
}

export function IconPickerFooter({
  onClose,
  handleApply,
  stagedIcon,
  applying
}: IconPickerFooterProps) {
  return (
    <div
      className="p-5 flex items-center justify-end gap-3 shrink-0"
      style={{ borderTop: "1px solid var(--ip-border)", backgroundColor: "var(--ip-bg)" }}
    >
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleApply}
        disabled={!stagedIcon || applying}
        className="px-6"
      >
        {applying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        Apply icon
      </Button>
    </div>
  );
}

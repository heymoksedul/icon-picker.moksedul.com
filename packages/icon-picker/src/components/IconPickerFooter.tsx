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
      className="px-5 md:px-6 py-4 md:py-5 flex items-center justify-end gap-3 shrink-0"
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
        Apply
      </Button>
    </div>
  );
}

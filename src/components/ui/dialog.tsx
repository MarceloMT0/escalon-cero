"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { buttonVariants } from "./button";

export function Dialog({
  title,
  description,
  trigger,
  children,
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay" />
        <DialogPrimitive.Content className="dialog-content">
          <DialogPrimitive.Title className="dialog-title">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="muted">{description}</DialogPrimitive.Description>
          <div className="dialog-body">{children}</div>
          <DialogPrimitive.Close
            className={buttonVariants({ variant: "ghost", size: "icon" }) + " dialog-close"}
            aria-label="Cerrar"
          >
            <X size={20} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

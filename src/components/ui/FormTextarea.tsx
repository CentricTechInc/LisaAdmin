import React from "react";
import { cn } from "@/lib/utils";

export type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  wrapperClassName?: string;
};

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, wrapperClassName, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2", wrapperClassName)}>
        {label && (
          <label className="text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "min-h-[100px] w-full rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 py-3 text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] placeholder:text-[color-mix(in_oklab,var(--color-muted-foreground)_60%,transparent)] focus:border-[#FF4460] focus:outline-none focus:ring-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export default FormTextarea;

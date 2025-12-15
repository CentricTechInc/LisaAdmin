import React from "react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./Input";

export type FormInputProps = InputProps & {
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, wrapperClassName, labelClassName, className, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-2", wrapperClassName)}>
        {label && (
          <label
            className={cn(
              "text-sm text-[color-mix(in_oklab,var(--color-foreground)_85%,transparent)]",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <Input
          ref={ref}
          className={cn(
            "rounded-[1.25rem] border border-[color-mix(in_oklab,var(--color-muted)_60%,transparent)] bg-white px-4 text-[color-mix(in_oklab,var(--color-muted-foreground)_85%,transparent)] placeholder:text-[color-mix(in_oklab,var(--color-muted-foreground)_60%,transparent)] focus:border-[#FF4460] focus:ring-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default FormInput;

"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxWithTextProps {
  name?: string;
  label: string;
  sublabel?: string;
  checked: boolean;
  onCheckedChange: (params?: any) => void;
}

export function CheckboxWithText({
  name,
  label,
  sublabel,
  checked,
  onCheckedChange,
}: CheckboxWithTextProps) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={name}
          className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  );
}

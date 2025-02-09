"use client";

import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

interface CustomDropdownProps {
  selectLabel?: string;
  placeholder?: string;
  options: string[];
  onChange: (value: string) => void;
}

export const CustomDropdown = ({
  selectLabel,
  placeholder,
  options,
  onChange,
}: CustomDropdownProps) => {
  const data = createListCollection({
    items: options.map((option, index) => ({
      index,
      label: option,
      value: option,
    })),
  });
  return (
    <SelectRoot collection={data} size="sm" width="320px">
      {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
      <SelectTrigger>
        <SelectValueText placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.items.map((option) => (
          <SelectItem
            item={option}
            key={option.index}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

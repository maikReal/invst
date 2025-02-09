import { CustomDropdown } from "@/components/ui/custom-dropdown";

interface StrategyCardProps {
  title: string;
  description: string;
  options: string[];
  value: string;
  selectLabel?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

import { Card } from "@chakra-ui/react";

export const StrategyCard = ({
  title,
  description,
  options,
  value,
  selectLabel,
  placeholder,
  onChange,
}: StrategyCardProps) => {
  return (
    <Card.Root width="320px" minHeight={"240px"}>
      <Card.Body gap="2">
        <Card.Title mt="2">{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-start">
        <CustomDropdown
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          selectLabel={selectLabel}
        />
      </Card.Footer>
    </Card.Root>
  );
};

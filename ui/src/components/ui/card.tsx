import { Flex, Heading, Text } from "@chakra-ui/react";

export const Card = ({
  title,
  description,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Flex
      flexDir={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      flex={1}
    >
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"start"}
        flex={1}
      >
        <Heading size={"3xl"}>{title}</Heading>
        <Heading size={"lg"}>{description}</Heading>
      </Flex>
    </Flex>
  );
};

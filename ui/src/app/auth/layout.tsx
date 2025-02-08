import { ChakraProvider, defaultSystem, Flex } from "@chakra-ui/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      flexDir={"column"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flex={1}
    >
      {children}
    </Flex>
  );
}

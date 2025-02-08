import { Flex } from "@chakra-ui/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      h={"100vh"}
      flexDir={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      flex={1}
    >
      {children}
    </Flex>
  );
}

"use client";

import { Flex, Heading } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
export default function AccountAuth() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  if (authenticated) {
    router.push("/dashboard");
  }

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
      flexDir={"column"}
      gap={"2rem"}
    >
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"1rem"}
      >
        <Heading size={"5xl"} fontStyle={"italic"}>
          Invst
        </Heading>
        <Heading size={"sm"} fontWeight={"normal"} color={"gray.500"}>
          One click to open full investemtn potential with crypto and AI
        </Heading>
      </Flex>
      <Button size={"lg"} p={"1rem"} onClick={() => login()} loading={!ready}>
        <Heading size={"lg"}>{!ready ? "Loading..." : "Launch app"}</Heading>
      </Button>
    </Flex>
  );
}

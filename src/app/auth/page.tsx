import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
export default function AccountAuth() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const router = useRouter();

  if (!ready) {
    return <Button loading={!ready}>Loading...</Button>;
  }

  if (authenticated) {
    router.push("/dashboard");
  }

  return <Button onClick={() => login()}>Login</Button>;
}

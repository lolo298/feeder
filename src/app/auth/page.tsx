"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function Auth() {
  const router = useRouter();
  async function signin(provider: "email" | "anonymous") {
    if (provider === "anonymous") {
      const user = await authClient.signIn.anonymous();
      if (!user.error) {
        router.push("/today");
      }
    } else {
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={() => signin("anonymous")}>
        Anonymous
      </Button>
    </div>
  );
}

export default Auth;

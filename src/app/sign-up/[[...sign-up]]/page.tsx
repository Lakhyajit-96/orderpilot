import { SignUp } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flags } from "@/lib/env";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      {flags.hasClerk ? (
        <SignUp />
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <Badge variant="violet">Auth setup required</Badge>
            <CardTitle className="mt-4 text-3xl">Clerk sign-up flow is waiting for keys</CardTitle>
            <CardDescription className="text-base leading-8">
              Configure Clerk to turn this design system into a multi-tenant SaaS onboarding experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-white/68">
            Once the keys are present, this route becomes the real self-serve acquisition entry point for the product.
          </CardContent>
        </Card>
      )}
    </div>
  );
}


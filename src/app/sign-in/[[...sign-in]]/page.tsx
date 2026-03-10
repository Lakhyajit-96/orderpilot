import { SignIn } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flags } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      {flags.hasClerk ? (
        <SignIn />
      ) : (
        <Card className="max-w-xl">
          <CardHeader>
            <Badge variant="violet">Auth setup required</Badge>
            <CardTitle className="mt-4 text-3xl">Clerk is not configured yet</CardTitle>
            <CardDescription className="text-base leading-8">
              Add your Clerk publishable and secret keys to enable secure sign-in for the OrderPilot workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-white/68">
            Until then, the app stays in demo workspace mode so the product can keep evolving without blocking on credentials.
          </CardContent>
        </Card>
      )}
    </div>
  );
}


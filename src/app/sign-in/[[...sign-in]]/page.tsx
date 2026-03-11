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
        <Card className="w-full max-w-xl">
          <CardHeader>
            <Badge variant="violet">Workspace access</Badge>
            <CardTitle className="mt-4 text-3xl">Sign-in will be available soon</CardTitle>
            <CardDescription className="text-base leading-8">
              Secure workspace access is still being finalized for this site.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-white/68">
            Once it is ready, your team will be able to access its workspace from this page.
          </CardContent>
        </Card>
      )}
    </div>
  );
}


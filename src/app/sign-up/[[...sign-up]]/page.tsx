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
            <Badge variant="violet">Team access</Badge>
            <CardTitle className="mt-4 text-3xl">New team access will be available soon</CardTitle>
            <CardDescription className="text-base leading-8">
              Self-serve workspace access is still being finalized for this site.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-white/68">
            Once it is ready, teammates will be able to create or join a workspace from this page.
          </CardContent>
        </Card>
      )}
    </div>
  );
}


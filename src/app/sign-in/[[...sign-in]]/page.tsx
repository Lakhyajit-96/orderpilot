import { SignIn } from "@clerk/nextjs";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flags } from "@/lib/env";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <MarketingHeader compact />
      <div className="flex flex-1 items-center justify-center px-1 py-12">
        {flags.hasClerk ? (
          <SignIn />
        ) : (
          <Card className="max-w-xl">
            <CardHeader>
              <Badge variant="violet">Sign-in setup required</Badge>
              <CardTitle className="mt-4 text-3xl">Sign-in isn&apos;t available yet</CardTitle>
              <CardDescription className="text-base leading-8">
                This environment still needs sign-in keys before secure workspace access can be enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/68">
              Once sign-in is configured, your team will be able to access its workspace from this page.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


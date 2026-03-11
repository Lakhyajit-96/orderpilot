import { SignUp } from "@clerk/nextjs";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flags } from "@/lib/env";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <MarketingHeader compact />
      <div className="flex flex-1 items-center justify-center px-1 py-12">
        {flags.hasClerk ? (
          <SignUp />
        ) : (
          <Card className="max-w-xl">
            <CardHeader>
              <Badge variant="violet">Sign-up setup required</Badge>
              <CardTitle className="mt-4 text-3xl">Sign-up isn&apos;t available yet</CardTitle>
              <CardDescription className="text-base leading-8">
                This environment still needs sign-in keys before self-serve workspace access can be enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/68">
              Once configured, new teammates will be able to create or join a workspace from this page.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


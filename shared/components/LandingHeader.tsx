"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/shared/components/ui/button";
import Logo from "@/shared/components/Logo";
import Link from "next/link";

function Header() {
  return (
    <header className="bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
export default Header;

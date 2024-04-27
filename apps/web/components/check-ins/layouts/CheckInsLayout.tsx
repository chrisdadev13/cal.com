import { useSession } from "next-auth/react";
import type { ComponentProps } from "react";
import React from "react";

import { ShellMain } from "@calcom/features/shell/Shell";

type CheckInsLayoutProps = {
  children: React.ReactNode;
  actions?: (className?: string) => JSX.Element;
} & Omit<ComponentProps<typeof ShellMain>, "actions">;

export default function CheckInsLayout({ children, actions, ...rest }: CheckInsLayoutProps) {
  const session = useSession();
  if (session.status === "loading") return <></>;

  return (
    <ShellMain {...rest} actions={actions?.("block")} hideHeadingOnMobile>
      <div className="flex flex-col xl:flex-row">
        <main className="w-full">
          <>{children}</>
        </main>
      </div>
    </ShellMain>
  );
}

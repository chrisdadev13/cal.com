"use client";

import type { ChangeEventHandler } from "react";
import { useState } from "react";

import { NewCalLinkButton } from "@calcom/features/check-ins/components/NewCalLinkButton";
import Shell from "@calcom/features/shell/Shell";
import { classNames } from "@calcom/lib";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";
import type { HorizontalTabItemProps } from "@calcom/ui";
import { HorizontalTabs, TextField } from "@calcom/ui";
import { Icon } from "@calcom/ui";

import { getServerSideProps } from "@lib/apps/getServerSideProps";

import PageWrapper from "@components/PageWrapper";
import CheckInsLayout from "@components/check-ins/layouts/CheckInsLayout";

const tabs: HorizontalTabItemProps[] = [
  {
    name: "Contacts",
    href: "/check-ins",
  },
  {
    name: "Contacts Booked",
    href: "/check-ins/contacts/books",
  },
];

function ContactsSearch({
  onChange,
  className,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <TextField
      className="bg-subtle !border-muted !pl-0 focus:!ring-offset-0"
      addOnLeading={<Icon name="search" className="text-subtle h-4 w-4" />}
      addOnClassname="!border-muted"
      containerClassName={classNames("focus:!ring-offset-0 m-1", className)}
      type="search"
      autoComplete="false"
      onChange={onChange}
      placeholder={t("search")}
    />
  );
}

export default function CheckIns({}: Omit<inferSSRProps<typeof getServerSideProps>, "trpcState">) {
  const { t } = useLocale();
  const [searchText, setSearchText] = useState<string | undefined>(undefined);

  return (
    <CheckInsLayout
      isPublic
      heading={t("My Cal Links")}
      subtitle={t("Save and interact with your Cal links in one place.")}
      actions={(className) => (
        <div className="flex w-full flex-col pt-4 md:flex-row md:justify-between md:pt-0 lg:w-auto">
          <div className="ltr:mr-2 rtl:ml-2 lg:hidden">
            <HorizontalTabs tabs={tabs} />
          </div>
          <div>
            <NewCalLinkButton />
          </div>
        </div>
      )}
      headerClassName="sm:hidden lg:block hidden">
      <div className="flex flex-col gap-y-8">
        <h1>Hola QLQ</h1>
      </div>
    </CheckInsLayout>
  );
}

export { getServerSideProps };

CheckIns.PageWrapper = PageWrapper;
CheckIns.getLayout = (page: React.ReactElement) => {
  return (
    <Shell
      title="Check ins"
      description="Save and interact with your Cal links in one place."
      withoutMain={true}
      hideHeadingOnMobile>
      {page}
    </Shell>
  );
};

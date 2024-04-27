import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { HttpError } from "@calcom/lib/http-error";
import { trpc } from "@calcom/trpc/react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  Form,
  InputField,
  SelectField,
  showToast,
} from "@calcom/ui";

export function NewCalLinkButton({
  name = "new-cal-link",
  fromEventType,
}: {
  name?: string;
  fromEventType?: boolean;
}) {
  const router = useRouter();
  const { t } = useLocale();

  const form = useForm<{
    name: string;
    tag: string;
    frequency: "Rarely" | "Often" | "Occasionally";
  }>();
  const { register } = form;
  //const utils = trpc.useUtils();
  const tagsOptions = [
    {
      label: "Relative",
      value: "Relative",
    },
    {
      label: "Friend",
      value: "Friend",
    },
    {
      label: "Coworker",
      value: "Coworker",
    },
  ];

  const checkFrequencyOptions = [
    {
      label: "Rarely",
      value: "Rarely",
    },
    {
      label: "Often",
      value: "Often",
    },
    {
      label: "Occassionally",
      value: "Occassionally",
    },
  ];

  const createMutation = trpc.viewer.checkIns.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      showToast("Cal link created successfully", "success");
    },
    onError: (err) => {
      if (err instanceof HttpError) {
        const message = `${err.statusCode}: ${err.message}`;
        showToast(message, "error");
      }

      if (err.data?.code === "UNAUTHORIZED") {
        const message = `${err.data.code}: ${t("error_schedule_unauthorized_create")}`;
        showToast(message, "error");
      }
    },
  });

  return (
    <Dialog name={name} clearQueryParamsOnClose={["copy-schedule-id"]}>
      <DialogTrigger asChild>
        <Button variant="fab" data-testid={name} StartIcon="plus">
          {t("new")}
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Add a new Cal contact"
        description="Add a contact to randomly check in with, using their Cal link or username">
        <Form
          form={form}
          handleSubmit={(values) => {
            createMutation.mutate({
              calUrl: values.name,
              tag: values.tag,
              checkInFrequency: values.frequency,
            });
          }}>
          <div className="grid grid-cols-2 ">
            <InputField
              label="Cal.com URL or Username"
              type="text"
              id="name"
              required
              className="w-full flex-1"
              placeholder="cal.com/rick"
              {...register("name")}
            />
            <Controller
              name="frequency"
              render={({ field: { value, onChange } }) => (
                <SelectField
                  containerClassName="ml-2 mt-[22px]"
                  onChange={(option) => {
                    onChange(option?.value === "Rarely");
                    if (option !== null) form.setValue("frequency", option.value);
                  }}
                  value={checkFrequencyOptions.find((tag) => tag.value === value)}
                  defaultValue={checkFrequencyOptions[0]}
                  options={checkFrequencyOptions}
                />
              )}
            />
          </div>
          <Controller
            name="tag"
            render={({ field: { value, onChange } }) => (
              <SelectField
                containerClassName="mb-2"
                label="Select a Tag for the link"
                onChange={(option) => {
                  onChange(option?.value === "Relative");
                  if (option !== null) form.setValue("tag", option.value);
                }}
                value={tagsOptions.find((tag) => tag.value === value)}
                defaultValue={tagsOptions[0]}
                options={tagsOptions}
              />
            )}
          />
          <DialogFooter>
            <DialogClose />
            <Button type="submit" loading={createMutation.isPending}>
              {t("continue")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

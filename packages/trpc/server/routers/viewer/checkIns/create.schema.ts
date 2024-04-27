import { z } from "zod";

const calUrlRegex = /^(?:https?:\/\/)?cal\.com\/([^\/?]+)/;

const checkInTime = ["Rarely", "Often", "Occasionally"] as const;

export const ZCreateInputSchema = z.object({
  calUrl: z.string().refine((url) => calUrlRegex.test(url), {
    message: "Invalid URL format for cal.com",
  }),
  tag: z.string(),
  checkInFrequency: z.enum(checkInTime),
});

export type TCreateInputSchema = z.infer<typeof ZCreateInputSchema>;

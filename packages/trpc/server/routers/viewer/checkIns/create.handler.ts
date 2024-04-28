import prisma from "@calcom/prisma";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../trpc";
import type { TCreateInputSchema } from "./create.schema";

type CreateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateInputSchema;
};

const calUrlRegex = /^(?:https?:\/\/)?cal\.com\/([^\/?]+)/;

const extractUsername = (url: string) => {
  const match = url.match(calUrlRegex);

  if (match) {
    const username = match[1];
    return { username };
  } else {
    return { username: null };
  }
};

export const create = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx;
  const { calUrl, tag, checkInFrequency } = input;

  const { username } = extractUsername(calUrl);

  if (!username) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid URL format for Cal.com",
    });
  }

  const contact = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatar: true,
      avatarUrl: true,
    },
  });

  if (!contact) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const contactAlreadyAdded = await prisma.contact.findFirst({
    where: {
      ownerId: user.id,
      username: username,
    },
  });

  if (contactAlreadyAdded) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Contact already added",
    });
  }

  const newContact = await prisma.contact.create({
    data: {
      userId: user.id,
      ownerId: user.id,
      username,
      tag,
      checkInFrequency,
      bio: contact.bio ?? "",
      name: contact.name ?? "",
      email: contact.email,
      slug: username,
    },
  });

  return newContact;
};

export default create;

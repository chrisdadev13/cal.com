import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { checkInsRouter } from "@calcom/trpc/server/routers/viewer/checkIns/_router";

export default createNextApiHandler(checkInsRouter);

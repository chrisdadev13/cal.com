import authedProcedure from "../../../procedures/authedProcedure";
import { importHandler, router } from "../../../trpc";
import { ZCreateInputSchema } from "./create.schema";

const NAMESPACE = "contacts";
const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const checkInsRouter = router({
  create: authedProcedure.input(ZCreateInputSchema).mutation(async (opts) => {
    const handler = await importHandler(namespaced("create"), () => import("./create.handler"));
    return handler(opts);
  }),
});

// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { tournamentRouter } from "./tournament";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tournament.", tournamentRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

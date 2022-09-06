import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const tournamentRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.tournament.findMany({
          select: {
            tournamentName: true,
            organizer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("createTournament", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.tournament.create({
          data: {
            tournamentName: input.name,
            organizerId: ctx.session?.user?.id,
            startDate: new Date("1/1/1"),
            endDate: new Date("1/2/1"),
            location: "Pensacola, FL",
            surfaceTypeId: "5",
            tournamentTypeId: "3",
            numberOfRounds: 2,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getAuthedUserTournaments", {
    async resolve({ ctx }) {
      try {
        return await prisma?.tournament.findMany({
          where: { organizerId: { in: ctx.session?.user?.id } },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

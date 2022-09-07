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
  .query("getTournamentSurfaceTypes", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.surfaceType.findMany();
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getTournamentTypes", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.tournamentType.findMany();
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
      tournamentName: z.string(),
      location: z.string(),
      surfaceType: z.string(),
      tournamentType: z.string(),
      numberOfRounds: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.tournament.create({
          data: {
            tournamentName: input.tournamentName,
            organizerId: ctx.session?.user?.id,
            startDate: new Date("1/1/1"),
            endDate: new Date("1/2/1"),
            location: "Pensacola, FL",
            surfaceTypeId: input.surfaceType,
            tournamentTypeId: input.tournamentType,
            numberOfRounds: input.numberOfRounds,
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

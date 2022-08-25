import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const ctx = trpc.useContext();
  const createTournament = trpc.useMutation("tournament.createTournament", {
    onMutate: () => {
      ctx.cancelQuery(["tournament.getAll"]);

      const optimisticUpdate = ctx.getQueryData(["tournament.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["tournament.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["tournament.getAll"]);
    },
  });
  const [tournamentName, setTournamentName] = useState("");

  if (status === "loading") {
    return <main>Loading...</main>;
  }
  return (
    <>
      <Head>
        <title>Sideout! - Run volleyball tournaments!</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {session ? (
          <div>
            <p>Hello {session.user?.name}</p>
            <button
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </button>
            <Tournaments />

            <div className="pt-6">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();

                  createTournament.mutate({
                    name: tournamentName,
                  });

                  setTournamentName("");
                }}
              >
                <input
                  type="text"
                  value={tournamentName}
                  placeholder="Your message..."
                  maxLength={100}
                  onChange={(event) => setTournamentName(event.target.value)}
                  className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              signIn("google");
            }}
          >
            Login with Google
          </button>
        )}
      </main>
    </>
  );
};

const Tournaments = () => {
  const { data: tournaments, isLoading } = trpc.useQuery(["tournament.getAll"]);
  const { data: userTournaments, isLoading: isLoadingUserTournaments } =
    trpc.useQuery(["tournament.getAuthedUserTournaments"]);

  if (isLoading || isLoadingUserTournaments)
    return <div>Fetching tournies...</div>;

  return (
    <div className="flex flex-col gap-4">
      {tournaments?.map((t, index) => {
        return (
          <div key={index}>
            <span>{t.name}</span>
            <p>Organized by {t.organizer?.name}</p>
          </div>
        );
      })}
      <div>
        THESE ARE TOURNAMENTS YOU HAVE / ARE RUNNING
        {userTournaments?.map((t, index) => {
          return (
            <div key={index}>
              <span>{t.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Home;

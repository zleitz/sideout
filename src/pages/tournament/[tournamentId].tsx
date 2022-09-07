import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Tournament = () => {
  const router = useRouter();
  const { tournamentId } = router.query;
  const { data: tournament, isLoading: isTournamentLoading } = trpc.useQuery([
    "tournament.getTournamentById",
    { id: tournamentId as string },
  ]);

  return (
    <div>
      <div>{tournament?.tournamentName}</div>
      <div>{tournament?.location}</div>
    </div>
  );
};

export default Tournament;

type MatchProps = {
  date: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  player1Score: number;
  player2Score: number;
  player3Score: number;
  player4Score: number;
  parlour_id: number;
  parlour_name: string;
}

export default function MatchCard({
  date,
  player1,
  player2,
  player3,
  player4,
  player1Score,
  player2Score,
  player3Score,
  player4Score,
  parlour_id,
  parlour_name,
}: MatchProps) {
  return (
    <a href="#" class="flex flex-col w-70 h-70 rounded shadow-lg bg-mj-green">
      <div class="flex flex-col items-center flex-grow gap-4 bg-white px-4 py-8">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-mj-green text-white text-2xl font-bold">
            KR
          </div>
          <div class="text-xl font-bold text-mj-green">
            Kristian Ruben
          </div>
      </div>
      <div class="flex items-center justify-center px-4 py-8 text-4xl text-white">
        MR: 1000
      </div>
    </a>
  );
}

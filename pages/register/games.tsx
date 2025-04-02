import { useState } from "react";
import Link from "next/link";

const games = ["Football", "Basketball", "Cricket", "Tennis"]; // Available games

export default function GamesRegistration() {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const handleGameSelection = (game: string) => {
    setSelectedGames((prevGames) =>
      prevGames.includes(game)
        ? prevGames.filter((g) => g !== game)
        : [...prevGames, game]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Select Games</h1>

        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Select Games</label>
          <div className="flex flex-wrap gap-4">
            {games.map((game) => (
              <label key={game} className="flex items-center">
                <input
                  type="checkbox"
                  value={game}
                  onChange={() => handleGameSelection(game)}
                  checked={selectedGames.includes(game)}
                  className="mr-2"
                />
                {game}
              </label>
            ))}
          </div>
        </div>

        <Link href="/register/students">
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-all mt-4"
            disabled={selectedGames.length === 0}
          >
            Next: Register Students
          </button>
        </Link>
      </div>
    </div>
  );
}

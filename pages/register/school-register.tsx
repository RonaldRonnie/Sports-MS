import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function SchoolRegister() {
  const [schoolName, setSchoolName] = useState('');
  const [district, setDistrict] = useState('');
  const [numStudents, setNumStudents] = useState<number>(0);
  const [principalName, setPrincipalName] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [coaches, setCoaches] = useState<string[]>(['']);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [games, setGames] = useState<string[]>([]);
  const router = useRouter();

  // Fetch games from the database
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) throw new Error('Failed to fetch games');
        const data: string[] = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
        setGames([]); // Ensure games array is always initialized
      }
    };

    fetchGames();
  }, []);

  // Handle game selection toggle
  const handleGameChange = (game: string) => {
    setSelectedGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    );
  };

  // Handle adding a new coach input field
  const addCoachField = () => {
    setCoaches([...coaches, '']);
  };

  // Handle coach name change
  const handleCoachChange = (index: number, value: string) => {
    const updatedCoaches = [...coaches];
    updatedCoaches[index] = value;
    setCoaches(updatedCoaches);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const schoolData = {
      name: schoolName,
      location: district,
      principal: principalName ? { name: principalName, role: 'Principal' } : null,
      tutor: tutorName ? { name: tutorName, role: 'Tutor' } : null,
      coaches: coaches.filter((name) => name).map((name) => ({ name, role: 'Coach' })),
      games: selectedGames,
      numStudents,
    };

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData),
      });

      if (response.ok) {
        router.push('/confirmation');
      } else {
        console.error('Failed to register school:', await response.text());
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-6">School Registration</h1>

        <div className="space-y-4">
          {/* School Name */}
          <div>
            <label className="block text-gray-800 font-medium">School Name</label>
            <Input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter school name"
              className="mt-2"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-gray-800 font-medium">District</label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Enter district"
              className="mt-2"
            />
          </div>

          {/* Number of Students */}
          <div>
            <label className="block text-gray-800 font-medium">Number of Students</label>
            <Input
              type="number"
              value={numStudents}
              onChange={(e) => setNumStudents(Number(e.target.value))}
              className="mt-2"
            />
          </div>

          {/* Principal Name */}
          <div>
            <label className="block text-gray-800 font-medium">Principal Name</label>
            <Input
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
              placeholder="Enter principal name"
              className="mt-2"
            />
          </div>

          {/* Tutor Name */}
          <div>
            <label className="block text-gray-800 font-medium">Tutor Name</label>
            <Input
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              placeholder="Enter tutor name"
              className="mt-2"
            />
          </div>

          {/* Coaches */}
          <div>
            <label className="block text-gray-800 font-medium">Coaches</label>
            {coaches.map((coach, index) => (
              <Input
                key={index}
                value={coach}
                onChange={(e) => handleCoachChange(index, e.target.value)}
                placeholder={`Enter coach ${index + 1} name`}
                className="mt-2"
              />
            ))}
            <Button
              onClick={addCoachField}
              className="mt-2 bg-teal-500 text-white hover:bg-teal-600"
            >
              Add Another Coach
            </Button>
          </div>

          {/* Select Games */}
          <div>
            <label className="block text-gray-800 font-medium">Select Games</label>
            <div className="mt-2">
              {games.length > 0 ? (
                games.map((game) => (
                  <div key={game} className="flex items-center">
                    <Checkbox
                      checked={selectedGames.includes(game)}
                      onChange={() => handleGameChange(game)}
                      className="mr-2"
                    />
                    <span className="text-gray-800">{game}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Loading games...</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white hover:bg-orange-600 mt-6"
          >
            Register School
          </Button>
        </div>
      </div>
    </div>
  );
}

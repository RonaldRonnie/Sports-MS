import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/router";

export default function PlayerRegistration() {
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedGames, setSelectedGames] = useState([]);
  const [schools, setSchools] = useState([]);
  const [availableGames, setAvailableGames] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch schools and games on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/schools");
        if (!response.ok) throw new Error("Failed to fetch schools");
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        setError("Error fetching schools: " + error.message);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games");
        if (!response.ok) throw new Error("Failed to fetch games");
        const data = await response.json();
        setAvailableGames(data);
      } catch (error) {
        setError("Error fetching games: " + error.message);
      }
    };

    fetchSchools();
    fetchGames();
  }, []);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle game selection
  const handleGameSelection = (gameId) => {
    setSelectedGames((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  // Validate and handle form submission
  const handleSubmit = async () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Basic validation
    if (!name) return setError("Player name is required");
    if (!registrationNumber) return setError("Registration number is required");
    if (!gender) return setError("Gender is required");
    if (!age || age <= 0) return setError("Valid age is required");
    if (!selectedSchool) return setError("School is required");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("registrationNumber", registrationNumber);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("position", position);
    formData.append("school", selectedSchool);
    formData.append("games", JSON.stringify(selectedGames));
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Player registered successfully!");
        setTimeout(() => router.push("/confirmation"), 1500); // Redirect after showing success
      } else {
        const errorText = await response.text();
        setError("Failed to register player: " + errorText);
      }
    } catch (error) {
      setError("Error submitting form: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-6">Player Registration</h1>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-gray-800 font-medium">Player Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player's name"
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-gray-800 font-medium">Registration Number</label>
            <Input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Enter registration number"
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-800 font-medium">Gender</label>
            <Select value={gender} onValueChange={setGender} disabled={isLoading}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-800 font-medium">Age</label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-gray-800 font-medium">Position</label>
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter position (e.g., Forward)"
              className="mt-2"
              disabled={isLoading}
            />
          </div>

          {/* School */}
          <div>
            <label className="block text-gray-800 font-medium">School</label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={isLoading}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                {schools.length > 0 ? (
                  schools.map((school) => (
                    <SelectItem key={school._id} value={school._id}>
                      {school.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No schools available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Games to Play */}
          <div>
            <label className="block text-gray-800 font-medium">Games to Play</label>
            <div className="mt-2 space-y-2">
              {availableGames.length > 0 ? (
                availableGames.map((game) => (
                  <div key={game._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGames.includes(game._id)}
                      onChange={() => handleGameSelection(game._id)}
                      className="mr-2"
                      disabled={isLoading}
                    />
                    <span className="text-gray-800">{game.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No games available</p>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-800 font-medium">Profile Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
              disabled={isLoading}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Player Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full"
              />
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white hover:bg-orange-600 mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Player"}
          </Button>
        </div>
      </div>
    </div>
  );
}
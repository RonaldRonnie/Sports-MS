"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Game {
  _id: string;
  name: string;
  type: "Individual" | "Team";
  description: string;
  rules: string;
  maxPlayers: number;
  minPlayers: number;
  date?: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/games");
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to fetch games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameData = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description"),
      rules: formData.get("rules"),
      maxPlayers: Number(formData.get("maxPlayers")),
      minPlayers: Number(formData.get("minPlayers")),
      date: formData.get("date") || new Date().toISOString(),
    };

    try {
      setLoading(true);
      if (editingGame) {
        await axios.patch(`http://localhost:5000/api/games/${editingGame._id}`, gameData);
        toast({ title: "Success", description: "Game updated successfully" });
      } else {
        await axios.post("http://localhost:5000/api/games", gameData);
        toast({ title: "Success", description: "Game created successfully" });
      }
      fetchGames();
      setIsOpen(false);
      setEditingGame(null);
    } catch (error: any) {
      console.error("Error saving game:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this game?");
    if (confirmDelete) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/games/${id}`);
        toast({ title: "Success", description: "Game deleted successfully" });
        fetchGames();
      } catch (error: any) {
        console.error("Error deleting game:", error.response?.data || error.message);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete game",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative space-y-6 p-8 bg-gray-50">
      {/* Moving Text Banner */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Games Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button aria-label="Add New Game" disabled={loading} className="bg-teal-900 text-white hover:bg-teal-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-800">{editingGame ? "Edit Game" : "Add New Game"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Name</Label>
                <Input id="name" name="name" defaultValue={editingGame?.name} required disabled={loading} className="bg-gray-100 text-gray-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-700">Type</Label>
                <Select name="type" defaultValue={editingGame?.type || "Individual"} disabled={loading} className="bg-gray-100 text-gray-800">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingGame?.description}
                  disabled={loading}
                  className="bg-gray-100 text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rules" className="text-gray-700">Rules</Label>
                <Textarea id="rules" name="rules" defaultValue={editingGame?.rules} disabled={loading} className="bg-gray-100 text-gray-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingGame?.date ? new Date(editingGame.date).toISOString().split("T")[0] : ""}
                  disabled={loading}
                  className="bg-gray-100 text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPlayers" className="text-gray-700">Min Players</Label>
                  <Input
                    id="minPlayers"
                    name="minPlayers"
                    type="number"
                    defaultValue={editingGame?.minPlayers}
                    required
                    disabled={loading}
                    className="bg-gray-100 text-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers" className="text-gray-700">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    defaultValue={editingGame?.maxPlayers}
                    required
                    disabled={loading}
                    className="bg-gray-100 text-gray-800"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-teal-900 text-white hover:bg-teal-800" disabled={loading}>
                {loading ? "Processing..." : editingGame ? "Update Game" : "Add Game"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid layout for games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center text-gray-600">Loading games...</div>
        ) : (
          games.map((game) => (
            <Card key={game._id} className="shadow-lg hover:shadow-2xl transition duration-300">
              <CardHeader className="bg-teal-900 text-white">
                <CardTitle>{game.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Type:</strong> {game.type}</div>
                  <div><strong>Description:</strong> {game.description}</div>
                  <div><strong>Rules:</strong> {game.rules}</div>
                  <div><strong>Players:</strong> {game.minPlayers} - {game.maxPlayers}</div>
                  <div><strong>Date:</strong> {game.date ? new Date(game.date).toLocaleDateString() : "N/A"}</div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => {
                      setEditingGame(game);
                      setIsOpen(true);
                    }}
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    aria-label="Edit Game"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(game._id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                    aria-label="Delete Game"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Image in the bottom-right corner of the screen */}
        <div className="relative space-y-6 p-8 bg-gray-50">
    {/* Moving Text Banner */}
    <div className="absolute bottom-4 right-4 w-full text-lg font-semibold text-teal-900 animate-marquee">
      Feel free to add or edit your games here
  </div>

  {/* Image in the bottom-right corner of the screen */}
    <img
      src="/images/im.jpeg"
      alt="Icon"
      className="absolute bottom-4 right-4 w-13 h-16 rounded-full shadow-lg"
    />
</div>
    </div>
  );
}

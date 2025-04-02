"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash } from 'lucide-react'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns'

interface Game {
  _id: string
  name: string
}

interface Player {
  _id: string
  name: string
}

interface Result {
  _id: string
  game: Game
  players: Array<{
    player: Player
    score: number
    position: number
  }>
  date: string
  venue: string
  status: 'Scheduled' | 'In Progress' | 'Completed'
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingResult, setEditingResult] = useState<Result | null>(null)
  const [selectedGame, setSelectedGame] = useState<string>('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const { toast } = useToast()

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/results')
      setResults(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch results",
        variant: "destructive"
      })
    }
  }

  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/games')
      setGames(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch games",
        variant: "destructive"
      })
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/players')
      setPlayers(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchResults()
    fetchGames()
    fetchPlayers()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const playerScores = selectedPlayers.map((playerId, index) => ({
      player: playerId,
      score: Number(formData.get(`score-${playerId}`)),
      position: index + 1
    }))

    const resultData = {
      game: formData.get('game'),
      players: playerScores,
      date: formData.get('date'),
      venue: formData.get('venue'),
      status: formData.get('status')
    }

    try {
      if (editingResult) {
        await axios.patch(`http://localhost:5000/api/results/${editingResult._id}`, resultData)
        toast({ title: "Success", description: "Result updated successfully" })
      } else {
        await axios.post('http://localhost:5000/api/results', resultData)
        toast({ title: "Success", description: "Result created successfully" })
      }
      fetchResults()
      setIsOpen(false)
      setEditingResult(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save result",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await axios.delete(`http://localhost:5000/api/results/${id}`)
        toast({ title: "Success", description: "Result deleted successfully" })
        fetchResults()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete result",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Results Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="game">Game</Label>
                <Select 
                  name="game" 
                  defaultValue={editingResult?.game._id}
                  onValueChange={setSelectedGame}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game._id} value={game._id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Players</Label>
                {players.map((player) => (
                  <div key={player._id} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`player-${player._id}`}
                      checked={selectedPlayers.includes(player._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlayers([...selectedPlayers, player._id])
                        } else {
                          setSelectedPlayers(selectedPlayers.filter(id => id !== player._id))
                        }
                      }}
                    />
                    <Label htmlFor={`player-${player._id}`}>{player.name}</Label>
                    {selectedPlayers.includes(player._id) && (
                      <Input
                        type="number"
                        name={`score-${player._id}`}
                        placeholder="Score"
                        className="w-24"
                        defaultValue={
                          editingResult?.players.find(p => p.player._id === player._id)?.score
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingResult?.date.split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  defaultValue={editingResult?.venue}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingResult?.status || 'Scheduled'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingResult ? 'Update Result' : 'Create Result'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Card key={result._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{result.game.name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingResult(result)
                      setIsOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(result._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Date:</span>{' '}
                  {format(new Date(result.date), 'PP')}
                </div>
                <div>
                  <span className="font-semibold">Venue:</span> {result.venue}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    result.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    result.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Players:</span>
                  <ul className="list-disc list-inside mt-2">
                    {result.players.map((player, index) => (
                      <li key={index} className="text-sm">
                        {player.player.name} - Score: {player.score}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash, Trophy } from 'lucide-react'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { format } from 'date-fns'

interface Player {
  _id: string
  name: string
  dateOfBirth: string
  gender: string
  ranking: number
  achievements: Array<{
    title: string
    date: string
    description: string
  }>
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false)
  const { toast } = useToast()

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
    fetchPlayers()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const playerData = {
      name: formData.get('name'),
      dateOfBirth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
    }

    try {
      if (editingPlayer) {
        await axios.patch(`http://localhost:5000/api/players/${editingPlayer._id}`, playerData)
        toast({ title: "Success", description: "Player updated successfully" })
      } else {
        await axios.post('http://localhost:5000/api/players', playerData)
        toast({ title: "Success", description: "Player created successfully" })
      }
      fetchPlayers()
      setIsOpen(false)
      setEditingPlayer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save player",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      try {
        await axios.delete(`http://localhost:5000/api/players/${id}`)
        toast({ title: "Success", description: "Player deleted successfully" })
        fetchPlayers()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete player",
          variant: "destructive"
        })
      }
    }
  }

  const handleAchievementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPlayer) return

    const formData = new FormData(e.currentTarget)
    const achievementData = {
      title: formData.get('title'),
      date: formData.get('date'),
      description: formData.get('description')
    }

    try {
      const updatedAchievements = [...(editingPlayer.achievements || []), achievementData]
      await axios.patch(`http://localhost:5000/api/players/${editingPlayer._id}`, {
        achievements: updatedAchievements
      })
      toast({ title: "Success", description: "Achievement added successfully" })
      fetchPlayers()
      setIsAchievementDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add achievement",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Player Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingPlayer ? 'Edit Player' : 'Add New Player'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPlayer?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={editingPlayer?.dateOfBirth?.split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={editingPlayer?.gender || 'Male'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingPlayer ? 'Update Player' : 'Create Player'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <Card key={player._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{player.name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingPlayer(player)
                      setIsAchievementDialogOpen(true)
                    }}
                  >
                    <Trophy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingPlayer(player)
                      setIsOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(player._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Date of Birth:</span>{' '}
                  {format(new Date(player.dateOfBirth), 'PP')}
                </div>
                <div>
                  <span className="font-semibold">Gender:</span> {player.gender}
                </div>
                <div>
                  <span className="font-semibold">Ranking:</span> {player.ranking}
                </div>
                {player.achievements && player.achievements.length > 0 && (
                  <div>
                    <span className="font-semibold">Achievements:</span>
                    <ul className="list-disc list-inside mt-2">
                      {player.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm">
                          {achievement.title} - {format(new Date(achievement.date), 'PP')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAchievementDialogOpen} onOpenChange={setIsAchievementDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Achievement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAchievementSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Add Achievement
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
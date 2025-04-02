// server/routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/games');

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new game
router.post('/', async (req, res) => {
  const { name, type, description, rules, maxPlayers, minPlayers, date } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ message: 'Game name is required' });
  }
  if (!type) {
    return res.status(400).json({ message: 'Game type is required' });
  }
  if (!maxPlayers || maxPlayers <= 0) {
    return res.status(400).json({ message: 'Max players must be a positive number' });
  }
  if (!minPlayers || minPlayers <= 0) {
    return res.status(400).json({ message: 'Min players must be a positive number' });
  }
  if (minPlayers > maxPlayers) {
    return res.status(400).json({ message: 'Min players cannot exceed max players' });
  }

  const game = new Game({
    name,
    type,
    description,
    rules,
    maxPlayers,
    minPlayers,
    date: date || new Date(), // Default to current date if not provided
  });

  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific game by ID
router.patch('/:id', async (req, res) => {
  const { name, type, description, rules, maxPlayers, minPlayers, date } = req.body;

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (name) game.name = name;
    if (type) game.type = type;
    if (description !== undefined) game.description = description;
    if (rules !== undefined) game.rules = rules;
    if (maxPlayers) {
      if (maxPlayers <= 0) {
        return res.status(400).json({ message: 'Max players must be a positive number' });
      }
      game.maxPlayers = maxPlayers;
    }
    if (minPlayers) {
      if (minPlayers <= 0) {
        return res.status(400).json({ message: 'Min players must be a positive number' });
      }
      game.minPlayers = minPlayers;
    }
    if (minPlayers && maxPlayers && minPlayers > maxPlayers) {
      return res.status(400).json({ message: 'Min players cannot exceed max players' });
    }
    if (date) game.date = date;

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific game by ID
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
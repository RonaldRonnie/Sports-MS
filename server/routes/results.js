const express = require('express');
const router = express.Router();
const Result = require('../models/results'); // Match the lowercase file name 'results.js'
const Game = require('../models/games');
const Player = require('../models/players');

// Get all results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find()
      .populate('game')
      .populate('players.player');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new result
router.post('/', async (req, res) => {
  const { game, players, date } = req.body;

  // Validate required fields
  if (!game) {
    return res.status(400).json({ message: 'Game is required' });
  }
  if (!players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ message: 'At least one player with a score is required' });
  }
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  // Validate game exists
  const gameDoc = await Game.findById(game);
  if (!gameDoc) {
    return res.status(404).json({ message: 'Game not found' });
  }

  // Validate players exist and scores are provided
  for (const { player, score } of players) {
    if (!player || !score) {
      return res.status(400).json({ message: 'Each player entry must have a player ID and score' });
    }
    const playerDoc = await Player.findById(player);
    if (!playerDoc) {
      return res.status(404).json({ message: `Player with ID ${player} not found` });
    }
  }

  const result = new Result({
    game,
    players,
    date,
  });

  try {
    const newResult = await result.save();
    await newResult.populate('game').populate('players.player');
    res.status(201).json(newResult);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a specific result by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('game')
      .populate('players.player');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific result by ID
router.patch('/:id', async (req, res) => {
  const { game, players, date } = req.body;

  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Update game if provided
    if (game) {
      const gameDoc = await Game.findById(game);
      if (!gameDoc) {
        return res.status(404).json({ message: 'Game not found' });
      }
      result.game = game;
    }

    // Update players if provided
    if (players && Array.isArray(players)) {
      for (const { player, score } of players) {
        if (!player || !score) {
          return res.status(400).json({ message: 'Each player entry must have a player ID and score' });
        }
        const playerDoc = await Player.findById(player);
        if (!playerDoc) {
          return res.status(404).json({ message: `Player with ID ${player} not found` });
        }
      }
      result.players = players;
    }

    // Update date if provided
    if (date) {
      result.date = date;
    }

    const updatedResult = await result.save();
    await updatedResult.populate('game').populate('players.player');
    res.json(updatedResult);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific result by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
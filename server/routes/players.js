const express = require('express');
const multer = require('multer');
const router = express.Router();
const Player = require('../models/players'); // Updated Player model
const School = require('../models/schools'); // Updated School model
const Game = require('../models/games'); // Updated Game model

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().populate('school').populate('games');
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new player
router.post('/', upload.single('image'), async (req, res) => {
  const { name, registrationNumber, gender, age, position, school, games } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate required fields
  if (!name || !registrationNumber || !gender || !age || !school) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if school exists
  const schoolDoc = await School.findById(school);
  if (!schoolDoc) {
    return res.status(404).json({ message: 'School not found' });
  }

  // Check if games exist
  const gameIds = JSON.parse(games || '[]');
  const gameDocs = await Game.find({ '_id': { $in: gameIds } });
  if (gameDocs.length !== gameIds.length) {
    return res.status(404).json({ message: 'One or more games not found' });
  }

  // Check for duplicate registration number
  const existingPlayer = await Player.findOne({ registrationNumber });
  if (existingPlayer) {
    return res.status(400).json({ message: 'Registration number already exists' });
  }

  const player = new Player({
    name,
    registrationNumber,
    gender,
    age,
    position,
    school,
    games: gameIds,
    image,
  });

  try {
    const newPlayer = await player.save();
    await newPlayer.populate('school').populate('games');
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get specific player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('school').populate('games');
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update player
router.patch('/:id', upload.single('image'), async (req, res) => {
  const { name, registrationNumber, gender, age, position, school, games } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  // Check if school exists
  if (school) {
    const schoolDoc = await School.findById(school);
    if (!schoolDoc) {
      return res.status(404).json({ message: 'School not found' });
    }
  }

  // Check if games exist
  let gameIds = [];
  if (games) {
    gameIds = JSON.parse(games || '[]');
    const gameDocs = await Game.find({ '_id': { $in: gameIds } });
    if (gameDocs.length !== gameIds.length) {
      return res.status(404).json({ message: 'One or more games not found' });
    }
  }

  // Check for duplicate registration number (excluding current player)
  if (registrationNumber) {
    const existingPlayer = await Player.findOne({ registrationNumber, _id: { $ne: req.params.id } });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Registration number already exists' });
    }
  }

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (registrationNumber) updateData.registrationNumber = registrationNumber;
    if (gender) updateData.gender = gender;
    if (age) updateData.age = age;
    if (position) updateData.position = position;
    if (school) updateData.school = school;
    if (gameIds.length > 0) updateData.games = gameIds;
    if (image) updateData.image = image;

    const player = await Player.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('school').populate('games');

    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
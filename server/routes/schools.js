const express = require('express');
const router = express.Router();
const School = require('../models/schools');
const Official = require('../models/officials');
const Game = require('../models/games');

// Get all schools
router.get('/', async (req, res) => {
  try {
    const schools = await School.find()
      .populate('principal')
      .populate('tutor')
      .populate('coaches')
      .populate('games');
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific school by ID
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate('principal')
      .populate('tutor')
      .populate('coaches')
      .populate('games');
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new school
router.post('/', async (req, res) => {
  try {
    const { name, location, principal, tutor, coaches, games } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'School name is required' });
    }

    // Convert game names to Game IDs
    const gameDocs = await Game.find({ name: { $in: games || [] } });
    if (gameDocs.length !== (games || []).length) {
      return res.status(404).json({ message: 'One or more games not found' });
    }
    const gameIds = gameDocs.map(game => game._id);

    // Create officials if provided
    const createOfficial = async (officialData) => {
      if (!officialData || !officialData.name) return null;
      const official = new Official({ ...officialData, school: null });
      await official.save();
      return official._id;
    };

    const principalId = await createOfficial(principal);
    const tutorId = await createOfficial(tutor);
    const coachIds = await Promise.all((coaches || []).map(createOfficial));

    // Create school
    const school = new School({
      name,
      location,
      principal: principalId,
      tutor: tutorId,
      coaches: coachIds.filter(id => id), // Filter out null values
      games: gameIds,
    });
    await school.save();

    // Update officials with school ID
    if (principalId) await Official.findByIdAndUpdate(principalId, { school: school._id });
    if (tutorId) await Official.findByIdAndUpdate(tutorId, { school: school._id });
    for (const coachId of coachIds) {
      if (coachId) await Official.findByIdAndUpdate(coachId, { school: school._id });
    }

    // Populate the response
    await school.populate('principal tutor coaches games');
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific school by ID
router.patch('/:id', async (req, res) => {
  try {
    const { name, location, principal, tutor, coaches, games } = req.body;

    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Update basic fields
    if (name) school.name = name;
    if (location !== undefined) school.location = location;

    // Update games if provided
    if (games) {
      const gameDocs = await Game.find({ name: { $in: games } });
      if (gameDocs.length !== games.length) {
        return res.status(404).json({ message: 'One or more games not found' });
      }
      school.games = gameDocs.map(game => game._id);
    }

    // Update officials if provided
    const createOfficial = async (officialData) => {
      if (!officialData || !officialData.name) return null;
      const official = new Official({ ...officialData, school: school._id });
      await official.save();
      return official._id;
    };

    if (principal) {
      const principalId = await createOfficial(principal);
      if (principalId) {
        if (school.principal) await Official.findByIdAndDelete(school.principal); // Remove old principal
        school.principal = principalId;
      }
    }

    if (tutor) {
      const tutorId = await createOfficial(tutor);
      if (tutorId) {
        if (school.tutor) await Official.findByIdAndDelete(school.tutor); // Remove old tutor
        school.tutor = tutorId;
      }
    }

    if (coaches) {
      const coachIds = await Promise.all(coaches.map(createOfficial));
      if (school.coaches.length > 0) {
        await Official.deleteMany({ _id: { $in: school.coaches } }); // Remove old coaches
      }
      school.coaches = coachIds.filter(id => id);
      for (const coachId of school.coaches) {
        if (coachId) await Official.findByIdAndUpdate(coachId, { school: school._id });
      }
    }

    await school.save();
    await school.populate('principal tutor coaches games');
    res.json(school);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a specific school by ID
router.delete('/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Delete associated officials
    if (school.principal) await Official.findByIdAndDelete(school.principal);
    if (school.tutor) await Official.findByIdAndDelete(school.tutor);
    if (school.coaches.length > 0) {
      await Official.deleteMany({ _id: { $in: school.coaches } });
    }

    await school.deleteOne();
    res.json({ message: 'School deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
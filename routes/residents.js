const express = require('express');
const { residents, validateResident, Resident } = require('../models/residents');
const { default: mongoose } = require('mongoose');
const router = express.Router();

// get all the residents
router.get('/', async (req, res) => {
  const resident = await Resident.find();
  res.status(200).send(resident);
});

// get a resident
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('invalid object id');
  const resident = await Resident.findById(req.params.id);
  if (!resident) return res.status(404).send('resident not found');
  res.status(200).send(resident);
});

// add a new resident
router.post('/', async (req, res) => {
  let resident = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    apartment: req.body.apartment,
    status: req.body.status,
    nationality: req.body.nationality,
  };

  const { value, error } = validateResident(resident);
  if (error) return res.status(500).send(error.details[0].message);
  resident = new Resident(value);
  await resident.save();
  res.status(200).send(resident);
});

// edit a resident
router.put('/:id', async (req, res) => {
  let resident = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dob: req.body.dob,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    apartment: req.body.apartment,
    status: req.body.status,
    nationality: req.body.nationality,
  };

  const { value, error } = validateResident(resident);
  if (error) return res.status(500).send(error.details[0].message);

  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('invalid object id');
  resident = await Resident.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!resident) return res.status(404).send('resident not found');
  res.status(200).send(resident);
});

// delete a resident
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('invalid object id');
  const resident = await Resident.findByIdAndRemove(req.params.id);
  if (!resident) return res.status(404).send('resident not found');
  res.status(200).send(resident);
});

module.exports = router;

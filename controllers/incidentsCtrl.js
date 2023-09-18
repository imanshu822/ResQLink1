const Incident = require("../models/incidentReport");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { validationResult } = require("express-validator"); // Import validation functions if needed

// Add a new incident
const addIncident = asyncHandler(async (req, res) => {
  try {
    const newIncident = await Incident.create(req.body);
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(500).json({ error: "Error creating incident" });
  }
});

// Get an incident by ID
const getAnIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.status(200).json(incident);
  } catch (error) {
    console.error("Error getting incident:", error);
    res.status(500).json({ error: "Error retrieving incident" });
  }
});

// Get all incidents
const getAllIncidents = asyncHandler(async (req, res) => {
  try {
    const allIncidents = await Incident.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Update an incident by ID
const updateIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to update only specified fields
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json(updatedIncident);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ error: "Error updating incident" });
  }
});

module.exports = {
  addIncident,
  getAnIncident,
  getAllIncidents,
  updateIncident,
};

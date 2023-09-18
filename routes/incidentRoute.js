const express = require("express");
const {
  addIncident,
  getAnIncident,
  getAllIncidents,
  updateIncident,
} = require("../controllers/incidentsCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { validationResult } = require("express-validator"); // Import validation functions if needed
const router = express.Router();

// Add a New Incident
router.post("/add-incident", authMiddleware, addIncident);

// Get an Incident by ID
router.get("/:id", getAnIncident);

// Get All Incidents (Authenticated)
router.get("/get-all-incidents", authMiddleware, getAllIncidents);

// Update an Incident by ID
router.put("/:id", authMiddleware, updateIncident);

module.exports = router;

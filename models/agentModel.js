const mongoose = require("mongoose");

const agents = new mongoose.Schema({
  agentRole: {
    type: "string",
    description: "Role or position of the agent within the agency",
  },
  agentName: {
    type: String,
    required: true,
  },
  agentID: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  distance: {
    type: Number,
  },
  agentAgencyID: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: "string",
    description: "Phone number of the agent",
  },
  agentLocation: {
    type: "object",
    properties: {
      latitude: {
        type: "double",
        description: "Agent's current latitude",
      },
      longitude: {
        type: "double",
        description: "Agent's current longitude",
      },
    },
    description: "Agent's live location",
  },
  agentStatus: {
    type: String,
    enum: ["Available", "Not Available"],
    default: "Available",
  },
  agentDescription: {
    type: String,
    // required: true,
  },
  agentDate: {
    type: Date,
    default: Date.now,
  },
  currentAssigned: {
    type: String,
    default: "None",
  },
});

module.exports = mongoose.model("Agents", agents);

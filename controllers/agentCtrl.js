const Agents = require("../models/agentModel");
const asyncHandler = require("express-async-handler");
const { sendEmail } = require("./emailCtrl");
const validateMongoDbId = require("../utils/validateMongodbId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAgent = asyncHandler(async (req, res) => {
  const { agentID } = req.body;
  // Check if the agent already exists
  const findAgent = await Agents.findOne({ agentID });
  if (!findAgent) {
    // Create a new agent
    // randomly generate the password
    const password = Math.random().toString(36).slice(-8);
    req.body.password = password;

    const newAgent = await Agents.create(req.body);
    res.json(newAgent);
  } else {
    res.status(400).json({ error: "Agent already exists" });
  }
});
// Get an agent
const getaAgent = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  try {
    // Assuming you have a validateMongoDbId function defined elsewhere
    if (!validateMongoDbId(_id)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const agent = await Agents.findById(_id);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    console.error("Error getting agent:", error);
    res.status(500).json({ error: "Error getting agent" });
  }
});

// get all agents
const getallAgents = asyncHandler(async (req, res) => {
  try {
    const agents = await Agents.find().sort({ distance: 1 });
    res.json(agents);
  } catch (error) {
    throw new Error(error);
  }
});

// Agent login
const agentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the agent by email
  const agent = await Agents.findOne({ email });

  if (!agent) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Compare the provided password with the agent's password
  // const passwordMatch = await bcrypt.compare(password, agent.password);

  // if (!passwordMatch) {
  //   return res.status(401).json({ error: "Invalid credentials" });
  // }
  // // If the credentials are valid, generate a JWT token for the agent
  // const token = jwt.sign({ agentId: agent._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  else if (agent.password === password) {
    res.json({ message: "Login Successflly" });
  }
});

module.exports = { createAgent, getaAgent, getallAgents, agentLogin };

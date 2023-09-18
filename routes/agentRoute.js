const express = require("express");
const router = express.Router();

const {
  getaAgent,
  createAgent,
  getallAgents,
  agentLogin,
} = require("../controllers/agentCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { sendEmail } = require("../controllers/emailCtrl");

router.post("/create-a-agent", authMiddleware, createAgent);
router.get("/get-all-agents", getallAgents);
router.get("/get-a-agent/:id", getaAgent);
router.post("/send-mail/:id", authMiddleware, sendEmail);
router.post("/agent-login", agentLogin);

module.exports = router;

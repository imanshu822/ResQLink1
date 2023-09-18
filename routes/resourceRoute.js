const express = require("express");
const {
  createResource,
  getAllResources,
  getAResource,
} = require("../controllers/resourcesCtrl");
const router = express.Router();

router.post("/create-a-resource", createResource);
router.get("/get-all-resources", getAllResources);
router.post("/get-a-resource", getAResource);

module.exports = router;

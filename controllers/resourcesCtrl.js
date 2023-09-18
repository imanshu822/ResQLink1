const Resource = require("../models/resourceModel"); // Import your resource model
const geolib = require("geolib");
const User = require("../models/userModel");

// Add a new resource
const createResource = async (req, res) => {
  try {
    const newResource = await Resource.create(req.body);
    res.status(201).json(newResource);
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ error: "Failed to add the resource" });
  }
};

// get all resources
const getAllResources = async (req, res) => {
  try {
    const { agencyId } = req.params; // Agency ID or unique identifier from the request

    // Find resources associated with the agency
    const resourcesForAgency = await Resource.find({ agencyId });

    res.status(200).json(resourcesForAgency);
  } catch (error) {
    console.error("Error showing resources:", error);
    res.status(500).json({ error: "Failed to show resources" });
  }
};
// Make sure to import the geolib library

const getAResource = async (req, res) => {
  const { resName } = req.body; // Extract 'resName' from 'req.body'

  try {
    // Find an agency that has the specified resource
    const agencyWithResource = await Agency.findOne({
      resources: {
        $elemMatch: {
          name: resName,
        },
      },
    });

    if (!agencyWithResource) {
      return res
        .status(404)
        .json({ error: "Agency with the specified resource not found" });
    }

    // Latitude, longitude, and required resource type from the requesting agency
    const { latitude, longitude } = agencyWithResource;
    const resourceType = agencyWithResource.resources.find(
      (resource) => resource.name === resName
    ).resourceType;

    // Find agencies with the required resource
    const agenciesWithResource = await Agency.find({
      "resources.name": resName,
    });

    // Calculate the distance between the requesting agency and each agency in the result
    const agenciesWithDistance = agenciesWithResource.map((agency) => {
      const distance = geolib.getDistance(
        { latitude, longitude },
        { latitude: agency.latitude, longitude: agency.longitude }
      );
      return { ...agency.toObject(), distance };
    });

    // Sort agencies by distance in ascending order
    agenciesWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(agenciesWithDistance);
  } catch (error) {
    console.error("Error searching for resources:", error);
    res.status(500).json({ error: "Failed to search for resources" });
  }
};

module.exports = getAResource;

async function searchResources(req, res) {}

module.exports = {
  createResource,
  getAllResources,
  getAResource,
};

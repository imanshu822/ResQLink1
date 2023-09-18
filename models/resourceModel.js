const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: String,
  quantity: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Available", "In Use", "Under Maintenance", "Out of Service"],
    default: "Available",
  },

  serialNumber: String,
  purchaseDate: Date,
  maintenanceHistory: [
    {
      date: Date,
      description: String,
    },
  ],
});

resourceSchema.index({ location: "2dsphere" }); // Create a geospatial index for location

module.exports = mongoose.model("Resource", resourceSchema);

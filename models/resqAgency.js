const mongoose = require("mongoose");

// Define the schema for the Rescue Agency
const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    agencyId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    logo_img: String,
    description: String,
    location: {
      type: {
        type: String,
        enum: ["Point"], // For geospatial indexing
        default: "Point",
      },
      coordinates: [Number], // [longitude, latitude]
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource", // Reference to the resources owned by the agency
      },
    ],
    contactPersons: [
      {
        name: String,
        role: String,
        email: String,
        phone: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a geospatial index for the location field
// resqAgencySchema.index({ location: "2dsphere" });

// Create a model for the Rescue Agency using the schema
const ResqAgency = mongoose.model("ResqAgency", agencySchema);

module.exports = ResqAgency;

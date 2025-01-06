import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StartupSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image", // Reference the Image model
    required: [true, "Logo is required"],
  },
  websiteUrl: {
    type: String,
    required: [true, "Website URL is required"],
  },
  hardwareTech: {
    type: String,
    required: [true, "Hardware Tech is required"],
  },
  hardwareInnovations: {
    type: String,
    required: [true, "Hardware Innovations is required"],
  },
  keyInvestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image", // Reference the Image model
  }],
  CustomersDetails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image", // Reference the Image model
  }],
  about: {
    type: String,
    required: [true, "About is required"],
  },
  metricFeatures: [{
    heading: {
      type: String,
    },
    metric: {
      type: String,
    },
    icon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image", // Reference the Image model
    },
  }],
  category: [{
    futureScope: {
      type: String,
    },
    stages: {
      type: String,
    },
    programmes: {
      type: String,
    },
  }],
});

export default model("Startup", StartupSchema);

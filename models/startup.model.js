import { Schema, model } from "mongoose"
import { FileSchema } from "./file.model.js"
const startupSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  logo: {
    type: FileSchema,
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
  keyInvestors: [FileSchema],
  CustomersDetails: [FileSchema],
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
      type: FileSchema,
    }
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

export default model("Startup", startupSchema);

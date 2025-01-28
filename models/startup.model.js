import mongoose from "mongoose";

const { Schema, model } = mongoose;

const StartupSchema = new Schema({
  name: {
    type: String,
  },
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image", // Reference the Image model
  },
  websiteUrl: {
    type: String,
  },
  hardwareTech: {
    type: String,
  },
  hardwareInnovations: {
    type: String,
  },
  keyInvestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    default:null// Reference the Image model
  }],
  CustomersDetails: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    default:null// Reference the Image model
  }],
  about: {
    type: String,
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
      ref: "Image",
      default:null// Reference the Image model
    },
  }],
  category: {
    futureScope: [
      {
        type: String,
      }
    ],
    stages: {
      type: String,
    },
    programmes: [{
      type: String,
    }],
  },

  grants: [{
    type: String,
  }],

  status : {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  }

});

export default model("Startup", StartupSchema);

import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
});

export default mongoose.model("Image", ImageSchema);

import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  fileId: {
    type: String,
  },
  name: {
    type: String,
  },
  url: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
});

export default mongoose.model("Image", ImageSchema);

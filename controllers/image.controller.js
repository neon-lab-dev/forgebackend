import catchAsyncError from "../middlewares/catch-async-error.js"
import getDataUri from "../utils/getUri.js";
import { uploadImage, deleteImage } from "../utils/upload.js";
import imageModel from "../models/file.model.js";
export const imageUpload = catchAsyncError(async (req, res) => {



  const image = await uploadImage(
    getDataUri(req.file).content,
    getDataUri(req.file).fileName,
    "mind-forge"
  );

  
  
  const newImage = await imageModel.create({
    fileId: image.fileId,
    name: image.name,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl,
  })
  res.status(201).json({ message: "Image uploaded successfully.", image: newImage });
});

export const imageDelete = catchAsyncError(async (req, res) => {

  const { fileId } = req.params;
  const deleted = await deleteImage(fileId);
  const image = await imageModel.findOneAndDelete({ fileId });
  if (!deleted) {
    return res.status(500).json({ message: "Failed to delete image." });
  }
  res.status(200).json({ message: "Image deleted successfully." });
});

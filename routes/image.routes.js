import { Router } from "express";
import singleUpload from "../middlewares/multer.js";
import { imageDelete, imageUpload } from "../controllers/image.controller.js";

const router = Router();



router.post("/upload", singleUpload, imageUpload);
router.delete("/delete/:fileId", imageDelete);




export default router;
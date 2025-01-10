import { Router } from "express";
import singleUpload from "../middlewares/multer.js";
import { imageDelete, imageUpload } from "../controllers/image.controller.js";
import { authenticate } from "../middlewares/auth.js";
const router = Router();



router.post("/upload", authenticate(), singleUpload, imageUpload);
router.delete("/delete/:fileId", authenticate(), imageDelete);




export default router;
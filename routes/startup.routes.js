import { Router } from "express";
import singleUpload from "../middlewares/multer.js";
import { createStartup } from "../controllers/startup.controller.js";

const router = Router();



router.post("/create", createStartup);




export default router;
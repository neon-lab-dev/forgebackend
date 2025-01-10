import { Router } from "express";
import { createStartup, getStartups, getSingleStartup, editStartup, deleteStartup } from "../controllers/startup.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();



router.post("/create", authenticate(), createStartup);
router.get("/", getStartups);
router.get("/:id", getSingleStartup).put("/:id", authenticate(), editStartup).delete("/:id", authenticate(), deleteStartup);


export default router;
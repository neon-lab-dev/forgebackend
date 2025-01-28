import { Router } from "express";
import { createStartup, getStartups, getSingleStartup, editStartup, deleteStartup, makeInactive, makeActive } from "../controllers/startup.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();



router.post("/create", authenticate(), createStartup);
router.get("/", getStartups);
router.get("/:id", getSingleStartup).put("/:id", authenticate(), editStartup).delete("/:id", authenticate(), deleteStartup);
router.put("/change-inactive/:id", authenticate(), makeInactive);
router.put("/change-active/:id", authenticate(), makeActive);


export default router;
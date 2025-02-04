import { Router } from "express";
import { createStartup, getStartups, getSingleStartup, editStartup, deleteStartup, makeInactive, makeActive, getProgramsAndGrants } from "../controllers/startup.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();



router.post("/create", authenticate(), createStartup);
router.get("/", getStartups);
router.put("/change-inactive/:id", authenticate(), makeInactive);
router.put("/change-active/:id", authenticate(), makeActive);
router.get("/programs-grants", getProgramsAndGrants);
router.get("/:id", getSingleStartup).put("/:id", authenticate(), editStartup).delete("/:id", authenticate(), deleteStartup);


export default router;
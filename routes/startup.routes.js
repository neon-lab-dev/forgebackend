import { Router } from "express";
import { createStartup, getStartups, getSingleStartup, editStartup, deleteStartup } from "../controllers/startup.controller.js";

const router = Router();



router.post("/create", createStartup);
router.get("/", getStartups);
router.get("/:id", getSingleStartup).put("/:id", editStartup).delete("/:id", deleteStartup);


export default router;
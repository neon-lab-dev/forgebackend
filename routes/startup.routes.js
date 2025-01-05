import { Router } from "express";
import { createStartup, getStartups, getSingleStartup } from "../controllers/startup.controller.js";

const router = Router();



router.post("/create", createStartup);
router.get("/", getStartups);
router.get("/:id", getSingleStartup);



export default router;
import { Router } from "express";
import * as notesController from "../controllers/notes.controller.js";

// ROUTE LAYER: maps HTTP method + URL to a controller function. Nothing else.
const router = Router();

router.get("/", notesController.list);
router.get("/:id", notesController.getOne);
router.post("/", notesController.create);
router.put("/:id", notesController.update);
router.delete("/:id", notesController.remove);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
    createNote,
    deleteNote,
    getNoteById,
    getNotes,
    updateNote,
} from "../controllers/note.controllers.js";
import {verifyRole} from "../middlewares/verifyRoles.middleware.js";

const router = Router();

router
    .route("/:projectId/getNotes")
    .get(verifyJWT,verifyRole, getNotes);

router
    .route("/:projectId/:noteId")
    .get(verifyJWT, verifyRole, getNoteById)
    .patch(verifyJWT,verifyRole, updateNote)
    .delete(verifyJWT,verifyRole, deleteNote);


router
    .route("/:projectId/createNote")
    .post(verifyJWT, verifyRole, createNote);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyUser } from "../controllers/auth.controllers.js";
import {
    createNote,
    deleteNote,
    getNoteById,
    getNotes,
    updateNote,
} from "../controllers/note.controllers.js";

const router = Router();

router
    .route("/porject/:projectId/notes/:noteId")
    .get(verifyJWT, verifyUser, getNoteById)
    .patch(verifyJWT, verifyUser, updateNote)
    .delete(verifyJWT, verifyUser, deleteNote);

router
    .route("/project/:projectId/notes/getNotes")
    .get(verifyJWT, verifyUser, getNotes);

router
    .route("/project/:projectId/notes/createNote")
    .post(verifyJWT, verifyUser, createNote);

export default router;

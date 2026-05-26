import { Router } from "express";
import {
    createTask,
    createSubTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
} from "../controllers/task.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { verifyRole } from "../middlewares/verifyRoles.middleware.js";

const router = Router();

router
    .route("/:projectId")
    .get(verifyJWT, verifyRole, getTasks)
    .post(verifyJWT, verifyRole, createTask);

router
    .route("/:projectId/:taskId")
    .get(verifyJWT, verifyRole, getTaskById)
    .patch(verifyJWT, verifyRole, updateTask)
    .delete(verifyJWT, verifyRole, deleteTask);

router
    .route("/subtask/:projectId/:taskId")
    .post(verifyJWT, verifyRole, createSubTask);

router
    .route("/subtask/:projectId/:subTaskId")
    .patch(verifyJWT, verifyRole, updateSubTask)
    .delete(verifyJWT, verifyRole, deleteSubTask);

export default router;
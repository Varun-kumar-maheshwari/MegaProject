import { Router } from "express";
import {
    addMemberToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject,
} from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router
    .route("/project")
    .get(verifyJWT, getProjects)
    .post(verifyJWT, createProject);

router
    .route("/project/:id")
    .get(verifyJWT, getProjectById)
    .patch(verifyJWT, updateProject)
    .delete(verifyJWT, deleteProject);

router
    .route("/project/:id/members")
    .get(verifyJWT, getProjectMembers)
    .post(verifyJWT, addMemberToProject);

router
    .route("/project/:id/members/:memberId")
    .delete(verifyJWT, deleteMember)
    .patch(verifyJWT, updateMemberRole);

export default router;

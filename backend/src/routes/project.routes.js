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
import {verifyRole} from "../middlewares/verifyRoles.middleware.js";

const router = Router();

router
    .route("/project")
    .get(verifyJWT, getProjects)
    .post(verifyJWT, createProject);

router
    .route("/:projectId")
    .get(verifyJWT, getProjectById)
    .patch(verifyJWT, updateProject)
    .delete(verifyJWT, deleteProject);

router
    .route("/:projectId/members")
    .get(verifyJWT, getProjectMembers)
    .post(verifyJWT, addMemberToProject);

router.route("/:projectId/addMember/:userId")
    .get(verifyJWT, addMemberToProject)

router
    .route("/:projectId/members/:memberId")
    .delete(verifyJWT, deleteMember)
    .patch(verifyJWT, updateMemberRole);

export default router;

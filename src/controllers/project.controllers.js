import {Project} from "../models/project.models.js";
import {ApiResponse} from "../utils/api-response.js";
import {ApiError} from "../utils/api-error.js";
import {Projectmember} from "../models/projectmember.models.js";
import {asyncHandler} from "../utils/asyn-handler.js";

const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const projects = await Projectmember.find({user: userId});
    console.log(projects);

    return res.status(200).json(new ApiResponse(200, projects, "projects"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const user = req.user;
    const projectMember = await Projectmember.findOne({
        project: projectId,
        user: user._id,
    });
    if (!projectMember) {
        throw new ApiError(
            401,
            "Not Found or You are not authorized to access this project.",
        );
    }
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not Found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully."));
});

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const user = req.user;

    const project = await Project.create({
        name: name,
        description: description,
        createdBy: user._id,
    });
    const projectMember = await Projectmember.create({
        user: user._id,
        project: project._id,
        role: "admin",
    });

    await project.save();
    await projectMember.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [project.name, project.description],
                "Project created successfully.",
            ),
        );
});

// add updated by in update Project
const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const userId = req.user._id;
    const {projectId} = req.params;
    const user = await Projectmember.findOne({
        user: userId,
        project: projectId,
        $or: [{role: "admin"}, {role: "projectAdmin"}],
    });

    if (!user) {
        throw new ApiError(
            401,
            "User not authorized to update this project or project does not exist.",
        );
    }

    if (!name && !description) {
        throw new ApiError(400, "Name and description is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(401, "Project not found");
    }

    if (name) {
        project.name = name;
    }
    if (description) {
        project.description = description;
    }

    await project.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [project.name, project.description],
                "Project updated successfully.",
            ),
        );
});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const user = req.user;
    const member = await Projectmember.findOne({
        user: user._id,
        project: projectId,
    });

    if (!member) {
        throw new ApiError(401, "Project not found");
    }

    if (member.role !== "admin") {
        throw new ApiError(
            401,
            "You are not authorized to delete this project.",
        );
    }
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(403, "Project not Found");
    }
    await Projectmember.deleteMany({project: projectId});
    await Project.deleteOne({_id: projectId});
    return res
        .status(200)
        .json(new ApiResponse(200, [user], "Project deleted successfully."));
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const user = req.user;

    const projectMember = await Projectmember.findOne({
        project: projectId,
        user: user._id,
    });

    if (!projectMember) {
        throw new ApiError(
            403,
            "Not Found or You are not authorized to access this project.",
        );
    }

    const projectMembers = await Projectmember.find({project: projectId});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                "Project members fetched successfully.",
            ),
        );
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const newMemberId = req.body.userId;
    const {projectId} = req.params;
    const user = await Projectmember.findOne({
        user: userId,
        project: projectId,
    });
    if (!user) {
        throw new ApiError(403, "User not found");
    }
    if (user.role !== "admin" && user.role !== "projectAdmin") {
        throw new ApiError(
            403,
            "Not Authorized to add members to this project.",
        );
    }

    const existingMember = await Projectmember.findOne({
        user: newMemberId,
        project: projectId,
    });
    if (existingMember) {
        throw new ApiError(400, "Member already exists in this project.");
    }

    const newProjectMember = await Projectmember.create({
        user: newMemberId,
        project: projectId,
    });
    await newProjectMember.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newProjectMember,
                "Project members add successfully.",
            ),
        );
});

const deleteMember = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {projectId} = req.params;
    const {memberId} = req.params;
    const user = await Projectmember.findOne({
        user: userId,
        project: projectId,
    });

    if (!user) {
        throw new ApiError(403, "User not found");
    }

    if (user.role !== "admin" && user.role !== "projectAdmin") {
        throw new ApiError(
            403,
            "Not Authorized to remove this member from this project.",
        );
    }
    console.log(userId + "    " + memberId);

    if (userId == memberId) {
        const totalAdmins = await Projectmember.countDocuments({
            project: projectId,
            role: "admin"
        })
        if (totalAdmins >= 2) {
            await Projectmember.deleteOne({
                project: projectId,
                user: userId,
            });
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        [projectId, memberId],
                        "Project member was removed successfully.",
                    ),
                );
        }
        throw new ApiError(400, "Cant remove yourself as you are last admin if you want to leave promote someone else to admin or delete the project");
    }

    const memberToDelete = await Projectmember.findOne({
        project: projectId,
        user: memberId,
    });
    console.log(memberToDelete)
    if (!memberToDelete) {
        throw new ApiError(404, "Member not found in this project.");
    }

    await Projectmember.deleteOne({
        project: projectId,
        user: memberId,
    });

    console.log("deleted")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [projectId, memberId],
                "Project member was removed successfully.",
            ),
        );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const {newRole} = req.body;
    const {projectId} = req.params;
    const {memberId} = req.params;
    const user = await Projectmember.findOne({
        user: userId,
        project: projectId,
    });

    if (!user) {
        throw new ApiError(403, "User not found");
    }

    if (user.role !== "admin" && user.role !== "projectAdmin") {
        throw new ApiError(
            403,
            "Not Authorized to update this member role from this project.",
        );
    }

    const validRoles = ["admin", "projectAdmin", "member"];
    if (!validRoles.includes(newRole)) {
        throw new ApiError(400, "Invalid role");
    }
    if (memberId == userId) {
        throw new ApiError(400, "cant change your own role");
    }
    const member = await Projectmember.findOne({
        project: projectId,
        user: memberId,
    });
    if (!member) {
        throw new ApiError(404, "Member not found");
    }
    member.role = newRole;
    await member.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                member,
                "Project member was updated successfully.",
            ),
        );
});

export {
    addMemberToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject,
};

import { Projectmember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyn-handler.js";

const verifyRole = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { projectId } = req.params;

    const projectMember = await Projectmember.findOne({
        project: projectId,
        user: userId,
    });
    if (!projectMember) {
        throw new ApiError(
            404,
            "You are not present in the project or Project doesnt exist",
        );
    }
    req.user.role = projectMember.role;
    next();
});

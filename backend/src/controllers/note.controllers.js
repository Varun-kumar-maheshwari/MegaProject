// boilderplate code

import { ProjectNote } from "../models/note.models.js";
import { Projectmember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyn-handler.js";

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const projectNotes = await ProjectNote.find({
        project: projectId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectNotes,
                "All the visible notes are given",
            ),
        );
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const user = req.user;

    if (!noteId) {
        throw new ApiError(404, "note id not provided");
    }

    const allowedRoles = ["admin", "projectAdmin", "member"];
    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "not authorized to see this note");
    }

    const note = await ProjectNote.findOne({
        _id: noteId,
    });

    return res.status(200).json(new ApiResponse(200, note, "Notes send"));
});

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { projectId } = req.params;

    const user = req.user;
    const allowedRoles = ["admin", "projectAdmin"];
    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(403, "Not authorized");
    }
    const note = await ProjectNote.create({
        project: projectId,
        user: user._id,
        content: content,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, note._id, "note save in db"));
});

const updateNote = asyncHandler(async (req, res) => {
    const allowedRoles = ["admin", "projectAdmin"];
    const user = req.user;
    const { content } = req.body;
    const { noteId } = req.params;

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "Not authorized to update this note.");
    }

    const note = await ProjectNote.findOne({
        _id: noteId,
    });
    if (!note) {
        throw new ApiError(404, "note doesnt exist");
    }

    note.content = content;

    await note.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                content,
                "the updated content is sent back to user",
            ),
        );
});

const deleteNote = asyncHandler(async (req, res) => {
    const allowedRoles = ["admin", "projectAdmin"];
    const user = req.user;
    const { noteId } = req.params;
    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(403, "Not authorized to delete this project");
    }
    const result = await ProjectNote.deleteOne({
        _id: noteId,
    });
    if (result.deletedCount === 0) {
        throw new ApiError(400, "Note not found by the provided note id ");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result.deletedCount,
                "the note has been deleted",
            ),
        );
});

export { createNote, deleteNote, getNoteById, getNotes, updateNote };

import {Task} from "../models/task.models.js";
import {asyncHandler} from "../utils/asyn-handler.js";
import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";
import {Projectmember} from "../models/projectmember.models.js";
import {TaskStatusEnum} from "../utils/constants.js";
import {SubTask} from "../models/subtask.models.js";
import mongoose from "mongoose";
// get all tasks
const getTasks = asyncHandler(async (req, res) => {
    const user = req.user;
    const {projectId} = req.params;
    const allowedRoles = ["admin", "projectAdmin"];

    if (!allowedRoles.includes(user.role)) {
        const tasks = await Task.find({
            assignedTo: user._id, project: projectId
        });
        if (!tasks) {
            throw new ApiError(400, "No tasks found for this specific project");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, tasks, "All tasks are send to user that are assigned to user",),);
    }

    const tasks = await Task.find({
        project: projectId,
    });
    if (!tasks) {
        throw new ApiError(400, "No tasks found for this specific project");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "All tasks in this project is send to user",),);
});

// get task by id
const getTaskById = asyncHandler(async (req, res) => {
    const user = req.user;
    const {taskId} = req.params;
    const allowedRoles = ["admin", "projectAdmin"];
    if (!allowedRoles.includes(user.role)) {
        const task = await Task.findOne({
            _id: taskId, assignedTo: user._id,
        });
        if (!task) {
            throw new ApiError(400, "No tasks are assigned to you or you dont have authorization to see this task",);
        }
        return res
            .status(200)
            .json(new ApiResponse(200, task, "Task with the specified id is sent to the user.",),);
    }
    const task = await Task.findOne({
        _id: taskId,
    });
    if (!task) {
        throw new ApiError(404, "No task found by this task id.");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task with the specified id is sent to the user.",),);
});

// create task
const createTask = asyncHandler(async (req, res) => {
    const allowedRoles = ["admin", "projectAdmin"];
    const user = req.user;
    const {projectId} = req.params;
    const {taskTitle, assignedUser} = req.body;

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "Not authorized to create tasks.");
    }

    const user2 = await Projectmember.findOne({
        user: assignedUser, project: projectId,
    });
    if (!user2) {
        throw new ApiError(400, "The user doesnt exist in this project.");
    }

    const task = await Task.create({
        assignedBy: user._id, assignedTo: assignedUser, project: projectId, title: taskTitle,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, task, "The task is successfully created."));
});

// update task
const updateTask = asyncHandler(async (req, res) => {
    const user = req.user;
    const {taskStatus, taskTitle, taskDescription} = req.body;
    const {taskId} = req.params;
    let task = await Task.findOne({
        _id: taskId,
    });
    if (!task) {
        throw new ApiError(400, "Task not found")
    }
    if (user.role == "member" && task.assignedTo == user._id) {
        task.status = taskStatus;
    }

    if (user.role == "projectAdmin" || task.assignedBy == user._id || user.role == "admin") {
        task.status = taskStatus ? taskStatus : task.status
        task.title = taskTitle ? taskTitle : task.title;
        task.description = taskDescription ? taskDescription : task.description;
    }
    task.save();
    return res
        .status(200)
        .json(new ApiResponse(200, task, "The updated task is send"));
});

// delete task
const deleteTask = asyncHandler(async (req, res) => {
    const user = req.user;
    const {taskId} = req.params;
    const allowedRoles = ["admin", "projectAdmin"];

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "Not authorized to delete this task");
    }

    const result = await Task.deleteOne({
        _id: taskId,
    });
    if (result.deletedCount === 0) {
        throw new ApiError(400, "Task not found by the provided id");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result.deletedCount, "The task was deleted successfully.",),);
});

// create subtask
const createSubTask = asyncHandler(async (req, res) => {
    const user = req.user;
    const {taskId} = req.params;
    const {title} = req.body;
    const allowedRoles = ["admin", "projectAdmin"];

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(400, "Not auth to create new sub Tasks ");
    }
    const subTask = await SubTask.create({
        title: title, createdBy: user._id, task: taskId
    })

    return res.status(200).json(new ApiResponse(200, subTask, "new sub task created"));

});

// update subtask
const updateSubTask = asyncHandler(async (req, res) => {
    const user = req.user;
    const {subtaskStatus, subtaskTitle} = req.body;
    const {subTaskId} = req.params;
    const allowedRoles = ["admin", "projectAdmin"]
    let subTask = await SubTask.findOne({
        _id: subTaskId,
    });
    if (!subTask) {
        throw new ApiError(400, "SubTask not found")
    }
    if (user.role == "admin" || (user.role == "projectAdmin" && subTask.createdBy == user._id)) {
        subTask.isCompleted = subtaskStatus;
    }
    if (user.role == "admin" || subTask.createdBy == user._id) {
        subTask.title = subtaskTitle ? subtaskTitle : subTask.title;
    }
    await subTask.save();
    return res
        .status(200)
        .json(new ApiResponse(200, subTask, "The updated subtask is send"));
});

// delete subtask
const deleteSubTask = asyncHandler(async (req, res) => {
    const user = req.user;
    const {subTaskId} = req.params;
    const allowedRoles = ["admin", "projectAdmin"];

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "Not authorized to delete this task");
    }

    const result = await SubTask.deleteOne({
        _id: subTaskId,
    });
    if (result.deletedCount === 0) {
        throw new ApiError(400, "SubTask not found by the provided id");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, result.deletedCount, "The subtask was deleted successfully.",),);
});

const getTaskStats = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    const stats = await SubTask.aggregate([{
        $match: {
            "task": new mongoose.Types.ObjectId(taskId), "isCompleted": false
        },
    }, {
        $group: {
            _id: "$task", notCompletedCount: {
                $sum: 1,
            },
            subTasksTitle : {
                $push : "$title"
            }
        }
    }, {
        $lookup: {
            from: "tasks", localField: "_id", foreignField: "_id", as: "taskDetails"
        },
    }, {
        $unwind : {
            path : "$taskDetails"
        }
    },
        {
        $project: {
            _id: 0, "taskDetails.title": 1, "taskDetails.status": 1, notCompletedCount: 1, subTasksTitle: 1,
        }
    }])

    if(!stats.length){
        throw new ApiError(404, "No incomplete subtasks remaining for this task")
    }

    const [objStats] = stats;


    return res
        .status(200)
        .json(new ApiResponse(200, objStats, "The task stats are sent."))
})

export {
    createSubTask, createTask, deleteSubTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask, getTaskStats
};




import { Task } from "../models/task.models.js";
import { asyncHandler } from "../utils/asyn-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Projectmember } from "../models/projectmember.models.js";
// get all tasks
const getTasks = asyncHandler(async (req, res) => {
    const user = req.user;
    const projectId = req.params;
    const allowedRoles = ["admin", "projectAdmin"];

    if (!allowedRoles.includes(user.role)) {
        const tasks = await Task.find({
            assignedTo: user._id,
        });
        if (!tasks) {
            throw new ApiError(400, "No tasks found for this specific project");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tasks,
                    "All tasks are send to user that are assigned to user",
                ),
            );
    }

    const tasks = await Task.find({
        project: projectId,
    });
    if (!tasks) {
        throw new ApiError(400, "No tasks found for this specific project");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "All tasks in this project is send to user",
            ),
        );
});

// get task by id
const getTaskById = asyncHandler(async (req, res) => {
    const user = req.user;
    const { taskId } = req.params;
    const allowedRoles = ["admin", "projectAdmin"];
    if (!allowedRoles.includes(user.role)) {
        const task = await Task.findOne({
            _id: taskId,
            assignedTo: user._id,
        });
        if (!task) {
            throw new ApiError(
                400,
                "No tasks are assigned to you or you dont have authorization to see this task",
            );
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    task,
                    "Task with the specified id is sent to the user.",
                ),
            );
    }
    const task = await Task.findOne({
        _id: taskId,
    });
    if (!task) {
        throw new ApiError(404, "No task found by this task id.");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task with the specified id is sent to the user.",
            ),
        );
});

// create task
const createTask = asyncHandler(async (req, res) => {
    const allowedRoles = ["admin", "projectAdmin"];
    const user = req.user;
    const { projectId } = req.params;
    const { taskTitle, assignedUser } = req.body;

    if (!allowedRoles.includes(user.role)) {
        throw new ApiError(401, "Not authorized to create tasks.");
    }

    const user2 = await Projectmember.findOne({
        user: assignedUser,
        project: projectId,
    });
    if (!user2) {
        throw new ApiError(400, "The user doesnt exist in this project.");
    }

    const task = await Task.create({
        assignedBy: user._id,
        assignedTo: assignedUser,
        project: projectId,
        title: taskTitle,
    });

    return res.status(200).json(new ApiResponse(200, task, "The task is successfully created."))
});

// update task
const updateTask = asyncHandler(async (req, res) => {
    const user = req.user
    const {taskStatus, taskTitle, taskDescription} = req.body
    const taskId = req.params
    let task = Task.findOne({
        _id : taskId
    })
    if(user.role == "member" && task.assignedTo == user._id){
        task.status = taskStatus;   
    }
    if((user.role == "projectAdmin" || task.assignedBy == user._id) && task.status  ){
        task.status = ;

    }
});

// delete task
const deleteTask = asyncHandler(async (req, res) => {
    // delete task
});

// create subtask
const createSubTask = asyncHandler(async (req, res) => {
    // create subtask
});

// update subtask
const updateSubTask = asyncHandler(async (req, res) => {
    // update subtask
});

// delete subtask
const deleteSubTask = asyncHandler(async (req, res) => {
    // delete subtask
});

export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
};

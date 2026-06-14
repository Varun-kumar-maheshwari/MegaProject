export const UserRolesEnum = {
    ADMIN : "admin",
    PROJECT_ADMIN : "projectAdmin",
    MEMBER : "member"
}

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const TaskStatusEnum = {
    TODO : "todo",
    IN_PROGRESS : "in_progress",
    DONE : "done"
}

export const AvailableTaskStatuses = Object.values(TaskStatusEnum)
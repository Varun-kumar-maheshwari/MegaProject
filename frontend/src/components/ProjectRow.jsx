import TaskCard from "./TaskCard.jsx";
import {useNavigate} from "react-router";


export default function ProjectRow({title, role, tasks}) {
    title = "Project"
    role = "Admin"

    let navigate = useNavigate();

    const handleUserClick = () => {

        navigate("/task")
    }

    const authProjectTasks = [
        {
            id: 1,
            title: "Configure JWT Access & Refresh Tokens",
            status: "Done"
        },
        {
            id: 2,
            title: "Build RBAC Middleware for Admin Routes",
            status: "In Progress"
        },
        {
            id: 3,
            title: "Test Authentication Endpoint Postman Collection",
            status: "To Do"
        },
        {
            id: 4,
            title : "testing",
            status : "In-Progress"
        }
    ];
    tasks = authProjectTasks
    return (
        <div className={"bg-gray-200  rounded-lg w-260 p-2 m-5 group relative"}>
            <div className={"flex flex-col"}>
                <div className={"flex justify-between pl-20 pr-20"}>
                    <p className={"font-bold text-mauve-600 text-3xl"}>{title}</p>
                    <div className={"flex rounded-lg w-max pl-5 pr-5 items-center"}>
                        <p className="bg-lime-50 rounded-3xl p-2 w-max text-olive-800 font-semibold">Role:
                            <span className="text-orange-300 pl-2 ">{role}</span>
                        </p>
                    </div>
                </div>
                <div className={"flex"}>
                    {
                        tasks.slice(0,3).map((task) => (
                            <TaskCard taskTitle={task.title} status={task.status} />
                        ))
                    }
                </div>
            </div>
            {tasks.length > 3 && <button
                onClick={handleUserClick}
                className={"opacity-0 group-hover:opacity-100 absolute h-1/1 bg-grad  w-50 right-0 top-1/2 -translate-y-1/2 bg-linear-to-r  to-90% to-olive-200  transition-all "}>Show
                More</button>}
        </div>
    )
}
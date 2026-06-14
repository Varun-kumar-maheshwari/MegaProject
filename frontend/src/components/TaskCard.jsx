import {useState} from "react";



export default function TaskCard({taskTitle, status}){

    return (
        <div className={"flex flex-col p-5 rounded-lg w-80 shadow-sm justify-between bg-gray-100 shadow-gray-300  m-3"} >
            <div>
                <h3 className ={"text-lg font-semibold text-gray-900 mb-1"}>{taskTitle}</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Status: <span className="font-medium text-amber-600">{status}</span>
                </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200 mt-2">
                Complete Task
            </button>
        </div>
    )
}
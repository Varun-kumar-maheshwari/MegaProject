import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TaskCard from "./components/TaskCard.jsx";
import ProjectRow from "./components/ProjectRow.jsx";
import {BrowserRouter, Routes, Route, useNavigate} from "react-router";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectRow />}/>
        <Route path="/task" element={<TaskCard taskTitle="Hi" status="To Do" />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

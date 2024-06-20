import React from 'react';
import '../../Styles/Task.css';
import TaskEachData from './TaskEachData';  // Import the new component

export default function Task({ task, isSlide }) {


  return (
    <div id='task' className={isSlide && "slide"}>
      <div className="taskDetail">
        <h5>Task Details</h5>
        <div className='dt'><i class="fa-solid fa-t"></i><p>Taskname</p> <p id='value'>{task.name}</p></div>
        <div className='dt'><i className="fa-solid fa-circle"></i><p>Description</p> <p id='value'>{task.description}</p></div>
        <div className='dt'><i className="fa-brands fa-product-hunt"></i><p>Priority</p> <p id='value'>{task.priority}</p></div>
        <div className='dt'><i className="fa-solid fa-signal"></i><p>Status</p> <p id='value'>{task.status}</p></div>
        <div className='dt'><i className="fa-solid fa-calendar-days"></i><p>Due Date</p> <p id='value'>{task.due}</p></div>
        <div className='dt'><i class="fa-solid fa-c"></i><p>Created At</p> <p id='value'>{task.createdAt}</p></div>
        <div className='dt'><i class="fa-solid fa-pen"></i><p>Updated At</p> <p id='value'>{task.updatedAt}</p></div>
      </div>

      <div className="assigneeDetail">
        <h5><i class="fa-solid fa-user"></i>Assignee Details</h5>
        <div className='dt'><p>Fullname</p> <p id='value'>{task.assignee.fullname}</p></div>
        <div className='dt'><p>Username</p> <p id='value'>{task.assignee.username}</p></div>
        <div className='dt'><p>Email</p> <p id='value'>{task.assignee.email}</p></div>
        <div className='dt'><p>Skills</p> <p id='value'>{task.assignee.skills.join(', ')}</p></div>
      </div>
    </div>
  );
}

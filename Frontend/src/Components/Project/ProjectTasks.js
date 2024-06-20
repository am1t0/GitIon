import React, { useEffect, useRef, useState } from 'react';
import "../../Styles/ProjectTasks.css";
import { useDispatch, useSelector } from 'react-redux';
import getAccessToken from '../../Utils/auth';
import { json, useParams } from 'react-router-dom';
import NewUpdTask from './NewUpdTask';
import { fetchMemberDetails } from '../../Data_Store/Features/memberSlice';
import { fetchCurrProject } from '../../Data_Store/Features/currProjectSlice';
import Task from './Task';

export default function ProjectTasks() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);    // conain array of taks fetched
  const [openTask, setOpenTask] = useState();  // opening the whold data about task on basis of it's id
  const [notFilled, setNotFilled] = useState(null); // during creation of task if not provided value in any of the inputs
  const [loading, setLoading] = useState(false);
  const { data } = useSelector((store) => store.currProject);
  const project = data;
  const themeImgRef = useRef();


  const { projectId } = useParams();    // extracting the current project's id from url 
  const [selectedTask, setSelectedTask] = useState(null);  //showing options for selected task only
  const [editedTaskData, setEditedTaskData] = useState(null);

  const handleThemeChange = async () => {

    setLoading(true);
    // getting the file from the ref
    const selectedFile = themeImgRef.current.files[0];

    // if file is not there 
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('theme', selectedFile);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/theme-upload/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        dispatch(fetchCurrProject(projectId));
      }

      setLoading(false);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleOpenTask = (taskId) => {
    if (openTask !== taskId)
      setOpenTask(taskId);
    else
      setOpenTask(null);
  }
  const formateDate = (date) => {

    // Create a new date object from the given date string
    const dateObj = new Date(date);

    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the month, day, and year components from the date object
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    // Format the date as "month name dd, yyyy"
    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate; // Output: "May 8, 2024"

  }
  const nameLogo = (name) => {
    return name[0].toUpperCase() + name.split(' ')[1][0].toUpperCase();
  }
  const statusClass = (status) => {

    switch (status) {
      case 'Not started':
        return 'not-State';

      case 'Pending':
        return 'p-State';

      default:
        return 'prog-State';
    }
  }
  function getUserColor(user) {
    // Convert user's unique identifier (e.g., ID, username, or email) to a numeric hash
    let hash = 0;
    for (let i = 0; i < user.length; i++) {
      hash = user.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to a hexadecimal color code
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
  }

  const handleEditTask = (task) => {
    setEditedTaskData(task);
  };
  const handleDeleteTask = async (taskId) => {

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tasks/task-delete/${project.owner}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      });

      console.log('respnse', response);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }
  const TaskId = (project, num) => {
    const id = (project.name[0] + project.name[1]).toUpperCase() + '-' + (num + 1);
    return id;
  }
  const handleRemAlert=()=>{
    setNotFilled(null);
  }
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tasks/getTasks/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        });

        if (!response.ok) {
          return Promise.reject(response);
        }
        const res = await response.json();

        // populating the tasks state
        setTasks(res.data);

      } catch (error) {
        return error.message || "An error occurred while loading";
      }
    }
    fetchTasks();

  }, [])
  return (
    <div id='tasks'>

      {
     notFilled &&  <div class="alert alert-danger"  id='notFill' role="alert" onClick={handleRemAlert}>
          <h6>{notFilled} is empty</h6>
          <h6 id='cnl'><i class="fa-solid fa-xmark"></i></h6>
        </div>
      }
      {/* user will put img they want for background */}
      <div id="themeImg">
        {!loading ?
          <>
            <img src={project?.theme} alt="" />
            <section className="changeThm">
              <input type="file" name='theme' ref={themeImgRef} onChange={handleThemeChange} />
              <p>Change theme</p>
            </section>
          </>
          : <div class="spinner-border" role="status" id='thm-load'>
            <span class="sr-only">Loading...</span>
          </div>
        }
      </div>
      <section className='tasktable'>
        <div className="manp">
          {/* just the task and logo  */}
          <section className='taskCube'>
            <h3><i class="fa-solid fa-cubes"></i></h3>
            <h3>Tasks</h3>
          </section>

          {/* various options to view tasks and manipulate */}
          <aside className='viewOp'>

            <div className="icns">
              <i class="fa-solid fa-filter"></i>       {/* filering the tasks on various basis */}
              <i class="fa-solid fa-arrow-up-short-wide"></i>
            </div>

            <div className="srch">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder='Search tasks...' />
            </div>
          </aside>
        </div>
        <table>
          <thead>
            <tr>
              <th ><div id='hd'>Task ID</div></th>
              <th ><div id='hd'>Task Name</div></th>
              <th ><div id='hd'><i class="fa-solid fa-signal"></i>Status</div></th>
              <th ><div id='hd'><i class="fa-solid fa-user"></i>Assignee</div></th>
              <th><div id='hd'><i class="fa-solid fa-calendar-days"></i>Due Date</div></th>
              <th><div id='hd'><i class="fa-brands fa-product-hunt"></i>Priority</div></th>
              <th><div id='hd'><i class="fa-solid fa-circle"></i>Description</div></th>
            </tr>
          </thead>
          <tbody>
            {tasks && tasks.map((task, index) => (
              editedTaskData !== task ? (
                <tr>
                  {/* TASK OPENING IF USER CLICKS ON ANY TASK  */}
                  {/* PUTTING <DIV> IN EACH <TD> AS STYLING IT IS TRICKY*/}
                  <td>
                    <div id='taskM'>
                      <p>
                        {TaskId(project, index)}
                      </p>
                      {/* OPTIONS SHOULD APPEAR TO ADMIN AND ON HOVER ONLY  */}
                      <div id='hovOp'  >
                        <i class="fa-solid fa-list-ul" onClick={(e) => {
                          e.preventDefault();
                          setSelectedTask(selectedTask !== task._id ? task._id : null);
                        }}>
                        </i>
                      </div>
                      {/* MANIPULATING TASK OPTIONS  */}
                    </div>
                    {selectedTask === task._id && (
                      <ul className="options-list">
                        <li onClick={() => handleEditTask(task)}><i class="fa-solid fa-pen" ></i><p>Edit</p></li>
                        <li onClick={() => handleDeleteTask(task._id)}><i class="fa-solid fa-trash"></i><p>Delete</p></li>
                      </ul>
                    )}
                  </td>
                  <td>
                    <div id="taskName">
                      <p>
                        <i class="fa-regular fa-file"></i>
                        {task.name}
                      </p>
                      <button className='opCl' id={`${openTask === task._id && 'close'}`} onClick={() => handleOpenTask(task._id)}>

                        {/* //SHOWING OPTIONS ACCORDING TO CURRENT STATE OF TASKS OPEN OR NOT */}
                        {openTask === task._id ? "CLOSE" : "OPEN"}

                      </button>
                      <Task task={task} isSlide={openTask === task._id} />
                    </div>
                  </td>

                  <td>
                    <div id="status">
                      <p className={statusClass(task.status)}> <div className="dot"></div>{task.status}</p>
                    </div>
                  </td>
                  <td>
                    <div id='assignee'>
                      <div className="circle" style={{ background: getUserColor(task.assignee.username) }}>
                        {nameLogo(task.assignee.fullname)}
                      </div>
                      <p>{task.assignee?.fullname}</p>
                    </div>
                  </td>
                  <td>
                    <p id='due'>{formateDate(task.due)}</p>
                  </td>
                  <td>
                    <div id='priority'>
                      <p className={task.priority}>{task.priority}</p>
                    </div>
                  </td>
                  <td>
                    <p id='descp'>{task.description}</p>
                  </td>
                </tr>)
                //  COMPONENT FOR UPDATING TASK
                : <NewUpdTask setTasks={setTasks} target={"update"} tasks={tasks} taskToUpdate={editedTaskData} setEditedTaskData={setEditedTaskData} getUserColor={getUserColor} />
            ))
            }
            <NewUpdTask setTasks={setTasks} tasks={tasks} target={"create"} getUserColor={getUserColor} setNotFilled={setNotFilled} />
            {/*  COMPONENT FOR CREATING TASK*/}
          </tbody>
        </table>
      </section>
    </div>
  );
}

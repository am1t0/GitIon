import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import getAccessToken from '../../Utils/auth';
import SearchedUsers from '../SearchedUsers';
import '../../Styles/NewUpdTask.css'

export default function NewUpdTask({ setTasks, tasks, target, taskToUpdate, setEditedTaskData, getUserColor,setNotFilled }) {
  const { data } = useSelector((store) => store.currProject);
  const { members } = useSelector((store) => store.member);
  const [inputValue, setInputValue] = useState(null);
  const [assign, setAssign] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);
  const flag = target === "create";

  const project = data;

  // data of new task creation collectin usng refs
  const nameRef = useRef();
  const statusRef = useRef();
  const dueRef = useRef();
  const priorityRef = useRef();
  const descriptionRef = useRef();

  const handleTaskCreate = async () => {
    const name = nameRef.current.value;
    const status = statusRef.current.value;
    const assignee = assign;
    const due = dueRef.current.value;
    const priority = priorityRef.current.value;
    const description = descriptionRef.current.value;
    
    
    // making the task object 
    const taskData = {
      name,
      status,
      assignee,
      due,
      priority,
      description
    };
    
    
        //checking if any of the parameters is empty
        for (const [key, value] of Object.entries(taskData)) {
          if (!value) {
            setNotFilled(key);
            return;
          }
        }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tasks/create-task/${project?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {

        return Promise.reject(response);
      }

      let newTask = await response.json();
      newTask = newTask.data;

      nameRef.current.value = null;
      statusRef.current.value = null;
      dueRef.current.value = null;
      priorityRef.current.value = null;
      descriptionRef.current.value = null;
      setAssign("");

      setTasks([...tasks, newTask]);
    } catch (error) {
      setTasks(tasks.filter((task) => task !== taskData));

      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    const name = nameRef.current.value;
    const status = statusRef.current.value;
    const assignee = assign;
    const due = dueRef.current.value;
    const priority = priorityRef.current.value;
    const description = descriptionRef.current.value;

    // making the task object 
    const taskData = {
      name,
      status,
      assignee,
      due,
      priority,
      description
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tasks/update-task/${project?.owner}/${taskToUpdate?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        return Promise.reject(response);
      }
      let updTask = await response.json();
      updTask = updTask.data;
      // Update existing task if it exists in the tasks array
      const updatedTasks = tasks.map(task => {
        if (task._id === updTask._id) {
          return updTask; // Update the task with new data
        }
        return task; // Keep other tasks unchanged
      });

      setTasks(updatedTasks);
      setAssign("");
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleChange = (value) => {
    setInputValue(value);
    const results = members.filter((member) => {
      return value &&
        member &&
        member.fullname &&
        member.fullname.toLowerCase().includes(value)

    })
    setSearchedUser(results);
  }

  return (
    <tr id='nwTask'>
      <td><button  id='crtUpBtn' onClick={flag ? handleTaskCreate : handleUpdateTask}>{target}</button></td>
      <td><input type="text" id='taskNameInp' autoComplete='off' placeholder='Task name' defaultValue={taskToUpdate?.name} ref={nameRef} required /></td>
      <td>
        <select ref={statusRef}  id='stateInp'>
          <option value="Not started" selected >Not started</option>
          <option value="Pending">Pending</option>
          <option value="In progress">In progress</option>
        </select>
      </td>

      <td >
        <div>
          <input type="search" id='assigneeInp'
            autoComplete='off'
            style={{ background: '' }}
            value={inputValue}
            onChange={(e) => { handleChange(e.target.value) }}
            placeholder='Search user'
          />
          <SearchedUsers
            setAssignee={setAssign}
            searchedUser={searchedUser}
            setInputValue={setInputValue}
            getUserColor={getUserColor}
            setSearchedUser={setSearchedUser}
          />
        </div>
      </td>
      <td >
        <input 
          type='date' 
          id='dueInp'  
          defaultValue={taskToUpdate?.due} 
          ref={dueRef} 
          autoComplete='off'
          />
      </td>
      <td >
        <select ref={priorityRef} id='priorityInp'>
          <option value="Low" selected>Low</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
        </select>
      </td>
      <td >
        <input 
        id='descripInp' 
        type="text" 
        defaultValue={taskToUpdate?.description} 
        placeholder='Description' ref={descriptionRef} 
        autoComplete='off'
        />
        </td>
    </tr>
  )
}

import React, { useState, useEffect, useRef } from 'react';
import CreateTasks from './CreateTasks'; // Assume this component handles creating tasks
import TodoList from './TodoList'; // Assume this component handles displaying tasks
import getAccessToken from '../../../Utils/auth.js'

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [action, setAction] = useState('');
  const [actionId, setActionId] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(false);
  const taskRef = useRef();
  const timeRef = useRef();

  useEffect(() => {

    const fetchTodos = async () => {
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          console.error('Access token not found');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/get-todos`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error:', response.statusText);
          return;
        }

        const data = await response.json();
        setTodos(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchTodos();
  }, [triggerFetch]); // Add triggerFetch as a dependency

  const handleCompletionTodo = async (todoId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark todo as done');
      }

      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
      setAction(updatedTodo.isDone ? 'Todo completed!' : 'Todo marked as incomplete!');
      setActionId(updatedTodo.isDone ?'visCreate':'undone');
      makeActionInvisible(1500);
      setTriggerFetch(prev => !prev); // Trigger useEffect to run again
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  const handleTodoCreate = async () => {
    let newTodo = {
      title: taskRef.current.value,
      time: timeRef.current.value,
    };

    if (!newTodo?.title) {
      setAction('Title Required');
      setActionId('req');
      makeActionInvisible(4000);
      return;
    } else if (!newTodo?.time) {
      setAction('Time Required');
      setActionId('req');
      makeActionInvisible(4000);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/create-todo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      const todoCreated = result.data;
      handleTodoCreated(todoCreated);

      taskRef.current.value = null;
      timeRef.current.value = null;
      setAction('Todo created successfully!');
      setActionId('visCreate');
      makeActionInvisible(2000);
      setTriggerFetch(prev => !prev); // Trigger useEffect to run again
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleTodoCreated = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const handleTodoDelete = async (todoId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }

      handleTodoDeleted(todoId);
      setAction('Todo deleted successfully!');
      setActionId('visDel');
      makeActionInvisible(2000);
      setTriggerFetch(prev => !prev); // Trigger useEffect to run again
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleTodoDeleted = (todoId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
  };

  const makeActionInvisible = (timeout) => {
    setTimeout(() => {
      setActionId('inv');
    }, timeout);
  };
  return (
    <aside id='todo'>
      <div className="Topic">
           <h2>Todo List</h2>
        </div>
      <section id='todoContainer'>
        <CreateTasks taskRef={taskRef} timeRef={timeRef} handleCreate={handleTodoCreate} />
        <h6 id={actionId} className='action' style={{ action }}>{action}</h6>
        <TodoList todos={todos} handleDelete={handleTodoDelete} handleCompletion={handleCompletionTodo} />
      </section>
    </aside>
  );
};

export default Todo;

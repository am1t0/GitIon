import React, { useRef } from 'react'
import getAccessToken from '../../Utils/auth.js';
import "../../Styles/CreateTodo.css"

export default function CreateTodo({handleTodoCreated,handleCreate}) {

    const titleRef = useRef();
    const descriptionRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/create-todo`, {
             method:'POST',
             headers: {
                'Content-Type': 'application/json',
                 'Authorization':`Bearer ${getAccessToken()}`
              },
              body: JSON.stringify({
                title: titleRef.current.value,
                description: descriptionRef.current.value,
              }),
          });
         
    
          const newTodo = await response.json();
        
          handleTodoCreated(newTodo.data);

          handleCreate();
    
          // Clear form fields
          titleRef.current.value = '';
          descriptionRef.current.value = '';
        } catch (error) {
          console.error('Error creating todo:', error.message);
          // Handle error
        }
      };
  return (
    <div className='todoCreate'>
      <div className='todoForm'>
    <form onSubmit={handleSubmit}>
       <div className="inputs">
         <h5>Create your todos</h5>
       </div>
      <div className='inputs'>
        <input type="text" id="title" ref={titleRef} required  placeholder='title'/>
      </div>
      <div className='inputs'>
        <textarea id="description" ref={descriptionRef} required placeholder='description'></textarea>
      </div>
      <div>
        <button className='btn btn-success mx-2' type="submit">Create</button>
        <button className='btn btn-danger mx-2' onClick={handleCreate}>Cancel</button>
      </div>
    </form>
      </div>
  </div>

  )
}

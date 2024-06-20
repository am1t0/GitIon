import React, { useState } from 'react'
import getAccessToken from '../../Utils/auth';
import "../../Styles/EachTodo.css"

export default function EachTodo({ todo, handleTodoDelete }) {
  const [arrow, setArrow] = useState(false);

  const handleDelete = async () => {
    try {
      // Assuming your server API endpoint for deleting a todo is '/api/todos/:id'
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${todo._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      });
      console.log('Delete is successfull!!')
      if (!response.ok) {
        throw new Error(`Error deleting todo: ${response.statusText}`);
      }
      handleTodoDelete(todo._id);

    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="covering">
       
      <div className="todo">
        <div 
        className="titleContainer"
        onClick={() => { setArrow(!arrow) }}>
          <div
            className="arrow"
            style={
              { rotate: (arrow) ? '0deg' : '-90deg' }
            }
          >

            <svg viewBox="-122.9 121.1 105.9 61.9" className="icon-arrow-down-mini" width="10" height="10">
              <path d="M-63.2,180.3l43.5-43.5c1.7-1.7,2.7-4,2.7-6.5s-1-4.8-2.7-6.5c-1.7-1.7-4-2.7-6.5-2.7s-4.8,1-6.5,2.7l-37.2,37.2l-37.2-37.2
    c-1.7-1.7-4-2.7-6.5-2.7s-4.8,1-6.5,2.6c-1.9,1.8-2.8,4.2-2.8,6.6c0,2.3,0.9,4.6,2.6,6.5l0,0c11.4,11.5,41,41.2,43,43.3l0.2,0.2
    C-73.5,183.9-66.8,183.9-63.2,180.3z"></path>
            </svg>
          </div>
          <div className="title">
            <h5>{todo.title}</h5>
          </div>
        </div>
  
        <div className="delete">
          <i onClick={handleDelete} className="fa-solid fa-trash"></i>
        </div>
      </div>
        <div className="description" style={{display: arrow ? "block": "none"}}>
          <p>{todo.description}</p>
        </div>
    </div>
    
  )
}

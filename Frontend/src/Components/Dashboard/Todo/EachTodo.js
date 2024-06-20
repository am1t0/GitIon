import React from 'react';
import '../../../Styles/EachTodo.css';

export default function EachTodo({ todo,handleDelete,handleCompletion }) {
  return (
    <div id='eachTodo' className='todo-container'>
       <input 
       type="checkbox"
        name="dnud"
        checked={todo.isDone}
        id="dnud"
        onChange={() => handleCompletion(todo._id)}
        />
       <p className='todo-title'>{todo.title}</p> 
       <p className='todo-date'>{todo.time}</p>
       <div className="manpTd">
       <i id='upd' class="fa-solid fa-pen-to-square"></i>
       <i id='del' class="fa-solid fa-trash" onClick={()=>handleDelete(todo._id)}></i>
       </div>
    </div>
  );
}

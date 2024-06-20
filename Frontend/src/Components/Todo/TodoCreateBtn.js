import React from 'react'
import CreateTodo from './CreateTodo'

export default function TodoCreateBtn({create,setCreate,handleTodoCreated,handleCreate}) {
  return (
    <div className="createBtn">
       
      {
       create 
       ? <CreateTodo handleTodoCreated={handleTodoCreated} handleCreate={handleCreate}/>
       :   
         <button className="btn btn-warning" onClick={() => setCreate(!create)}>Create Todo</button>
      }  
     </div>
  )
}

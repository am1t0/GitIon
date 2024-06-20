import React from 'react'
import EachTodo from './EachTodo'
import "../../Styles/TodoList.css"

export default function TodoList({todoList,handleTodoDelete}) {
  return (
    <div className='box'>
       <div className="todos">
       { 
        todoList.map((todo)=>{
            return <EachTodo todo={todo} handleTodoDelete={handleTodoDelete}/>
        })
       }
       </div>
    </div>
  )
}

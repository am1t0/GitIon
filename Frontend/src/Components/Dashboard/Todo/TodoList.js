import React from 'react'
import EachTodo from './EachTodo'

export default function TodoList({todos,handleDelete,handleCompletion}) {
  
  return (
       <section className="todoList">
          {/* below them the corresponding content will be shown   */}
          <div className="labels">
            <h6 id='tk'>TASK</h6>
            <h6 id='d'>DUE</h6>
          </div>

          {/* contaning the list of todos  */}
          <div className="todos">
            {
              todos?.map((todo)=>{
                return  <EachTodo todo={todo} handleDelete={handleDelete} handleCompletion={handleCompletion}/>
              })
            }
          </div>
       </section>
  )
}

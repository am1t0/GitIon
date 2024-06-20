import React from 'react'

export default function CreateTasks({taskRef,timeRef,handleCreate}) {
  return (
    <section className='creation'>
         {/* creation component bar  */}

        {/* for inputing the todo/taks from user  */}
         <input 
         type="text" 
         placeholder='Enter your task...' 
         id='td'
         ref={taskRef}
         autoComplete='off'
         />

         {/* for inputing time  */}
         <input
          type="time" 
          name="due" 
          id='du'
          ref={timeRef}
          autoComplete='off'
          />

          {/* button for creation of todo  */}
         <button 
         onClick={handleCreate}
         type="button" 
         id='crt'>
          create
        </button>
       </section>
   
  )
}

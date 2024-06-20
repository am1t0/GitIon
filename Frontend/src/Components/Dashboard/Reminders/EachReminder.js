import React, { useState } from 'react'
import '../../../Styles/EachReminder.css'
import getAccessToken from '../../../Utils/auth'

export default function EachReminder({ reminder, mnOp, handleReminderClick,setReminders,reminders,upDateClick}) {
    
    const handleDeleteReminder= async (id)=>{
         try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reminder/delete-reminder/${id}`,{
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${getAccessToken()}`
                 }
            });
            if(!response){
            console.error('Error:', response.statusText);
            return;
            }

            let data = await response.json();
            let deletedReminder = data.reminder;

            // updating reminder state by removing reminder deleted
            setReminders(reminders.filter((reminder)=> 
               { return  reminder._id!==deletedReminder._id}));

         } catch (error) {
            console.error('Error Deleting  reminder:', error.message);
         }
   }
   
   return (
        <div className="reminder">
            <div className='remHead'>
                <span className="remTag">{reminder.tag}</span>
                {/* on clicking dots options should be visible  */}
                <i class="fa-solid fa-ellipsis" id='dots' onClick={()=>handleReminderClick(reminder._id)}></i>
                {
                      mnOp===reminder._id &&
                      <ul id="opL">       {/* providing options of modifying plan onClicking three dots icon */}
                          <li  onClick={()=> upDateClick(reminder)}>
                            <i id="upd" class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                             <span>Edit</span>
                          </li>
                          <li onClick={()=> handleDeleteReminder(reminder._id)}>
                          <i id="del" class="fa-solid fa-trash" aria-hidden="true" ></i>
                           <span>Delete</span>
                           </li>
                       </ul>
                }
            </div>
            <div className='mBox'>
            <div className="remTitle">
                <h5>{reminder.title}</h5>
            </div>
            <div className="remDesc">
                <p>{reminder.description}</p>
            </div>
            </div>
            {/* creating a horizontal line */}
            <div className="hr">
                <hr />
            </div>
            <div className="remFoot">
                <div className="location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{reminder.location}</span>
                </div>
                 <div className="timeDate">
                    <p>{reminder.dueDate}</p>
                    <p>{reminder.time}</p>
                 </div>
            </div>
        </div>
    )
}

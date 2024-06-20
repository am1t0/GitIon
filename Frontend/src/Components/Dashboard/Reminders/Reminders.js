import React, { useEffect, useState } from 'react'
import Descripton from '../Description.js'
import RemindersList from './RemindersList.js';
import CreateReminder from './CreateReminder.js';
import '../../../Styles/Reminders.css'
import getAccessToken from '../../../Utils/auth.js';
import UpdateReminder from './UpdateReminder.js';

export default function Reminders() {

  const [reminders,setReminders] = useState([]);

  // for showing create reminder form 
  const [remForm,setRemForm] = useState(false);
  // for showing update form 
  const [updForm,setUpdForm] = useState(false);

  // content of reminder selected for updation
  const [remContent,setRemContent] = useState(null);

 const upDateClick=(reminder)=>{

     setUpdForm(true); // for showing the update form

     setRemContent(reminder); // providing update form the previous details of reminder
 }
  // fetching all reminders of users
  const fetchReminders = async()=>{
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reminder/get-reminders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error:', response.statusText);
        return;
      }

      let data = await response.json();
      data = data.reminders; 
      setReminders(data);

    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  }
  useEffect(()=>{
     fetchReminders();
  },[])

  return (
    <section id='reminder'>
      <div className="Topic">
        <h2>Reminders</h2>
      </div>

      {/* showing form for adding new reminder */}
      <div className="addnew" onClick={()=> setRemForm(true)}>
        <i class="fa-solid fa-plus"></i>
        <p id='add'>Add</p>
      </div>

{/* { showing create reminder form  */}
      {
        remForm && <CreateReminder setRemForm={setRemForm} setReminders={setReminders} reminders={reminders}/>
      }

{/* { showing update reminder form  */}
      {
        updForm && <UpdateReminder setUpdForm={setUpdForm} setReminders={setReminders} reminders={reminders} content={remContent}/>
      }

      {/* containing list of all reminders */}
      <RemindersList reminders={reminders} setReminders={setReminders} upDateClick={upDateClick}/>

    </section>
  )
}

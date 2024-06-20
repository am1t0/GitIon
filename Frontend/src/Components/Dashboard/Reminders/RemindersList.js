import React, { useState } from 'react'
import EachReminder from './EachReminder';
import '../../../Styles/RemindersList.css'

export default function RemindersList({reminders,setReminders,upDateClick}) {
 
      
    // state for showing options of reminder modifications
    const [mnOp,setMnOp] = useState(null);

    // setting the state to clicked reminder
    const handleReminderClick=(id)=>{
        if(mnOp===id){
            setMnOp(null);
        }
        else setMnOp(id);
    }
      
  return (
    <section className='RemindersList'>
 
    {/* { planSelected &&  <SelectedPlan plan={planSelected} setPlan={setPlanSelected}/>} */}
       
      {/* for showing list of all reminders  */}
      <div className="reminderlistContainer">
     {reminders?.map((reminder)=>{
       return  <EachReminder
          reminder={reminder} 
          mnOp={mnOp} 
          handleReminderClick={handleReminderClick}
          setReminders={setReminders}
          reminders={reminders}
          upDateClick={upDateClick}
          />
     })}
      </div>
   </section>
  )
}

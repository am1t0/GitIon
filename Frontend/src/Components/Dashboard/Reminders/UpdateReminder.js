import React, { useRef } from 'react'
import getAccessToken from '../../../Utils/auth';

export default function UpdateReminder({setUpdForm,setReminders,reminders,content}) {
    const formRef = useRef();

    const handleUpdate= async (e)=>{
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            tag: formData.get('tag')
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reminder/update-reminder/${content._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}` // Assuming you're using JWT token for authentication
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            let result = await response.json();
            result = result.reminder;
    
            //updating state by adding created reminder
            setReminders(reminders.map((reminder)=>{
                // replace the updated reminder 
                if(reminder._id===result._id)
                    return result;
                
                // all other reminders will be same
                else return reminder;
            }));
    
            //clear the form
            formRef.current.reset();
    
            //closing the repoForm
            setUpdForm(false);
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };
  return (

    //used the whole create-Reminder form classes and Ids
    <form className='remForm' ref={formRef} onSubmit={handleUpdate}>
    <h4 className='remFT'>Create Reminder</h4>
  <div className='remInp'>
    <label htmlFor="title">Title</label>
    <input defaultValue={content.title} type="text" id="title" name="title" />
  </div>
  <div className='remInp'>
    <label htmlFor="description">Description</label>
    <input defaultValue={content.description} name="description"></input>
  </div>
 
  <div id='tmDt'>
  <div className='remInp'>
    <label htmlFor="date">Date</label>
    <input defaultValue={content.date} type="date" id="date" name="date" />
  </div>
  <div className='remInp'>
    <label htmlFor="time">Time</label>
    <input defaultValue={content.time} type="time" id="time" name="time" />
  </div>
  </div>
  <div className="remInp">
  <label htmlFor="location">Location</label>
    <input defaultValue={content.location} type="text" id="location" name="location" />
  </div>
  <div className='remInp'>
    <label htmlFor="tag">Tag</label>
    <input defaultValue={content.tag} type="text" id="tag" name="tag" />
  </div>
  <div>
   <button className='remTCancel remBtn' type='button'onClick={()=>{setUpdForm(false)}} >cancel</button> 
  <button className='remBtn' type="submit">Save</button>
  </div>
</form>
  )
}

import React, { useRef } from 'react';
import '../../../Styles/CreateReminder.css'
import getAccessToken from '../../../Utils/auth';

export default function CreateReminder({setRemForm,setReminders}) {
  const formRef = useRef();

  const handleSubmit = async (e) => {
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reminder/create-reminder`, {
            method: 'POST',
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
        setReminders((reminders) => [...reminders, result]);

        //clear the form
        formRef.current.reset();

        //closing the repoForm
        setRemForm(false);
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='remForm'>
        <h4 className='remFT'>Create Reminder</h4>
      <div className='remInp'>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
      </div>
      <div className='remInp'>
        <label htmlFor="description">Description</label>
        <input name="description"></input>
      </div>
     
      <div id='tmDt'>
      <div className='remInp'>
        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" />
      </div>
      <div className='remInp'>
        <label htmlFor="time">Time</label>
        <input type="time" id="time" name="time" />
      </div>
      </div>
      <div className="remInp">
      <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" />
      </div>
      <div className='remInp'>
        <label htmlFor="tag">Tag</label>
        <input type="text" id="tag" name="tag" />
      </div>
      <div>
       <button className='remTCancel remBtn' type='button' onClick={()=>{setRemForm(false)}}>cancel</button> 
      <button className='remBtn' type="submit">Create</button>
      </div>
    </form>
  );
}


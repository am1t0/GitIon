import React, { useEffect, useRef } from 'react'
import getAccessToken from '../../../Utils/auth';

export default function CreatePlan({setPlanForm,setPlans,plans}) {
    const formRef = useRef();
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        duration: formData.get('duration'),
        tag: formData.get('tag')
    };

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/plans/create-plan`, {
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
         result = result.plan;

        //updating state by adding created reminder
        setPlans((plans) => [...plans, result]);

        //clear the form
        formRef.current.reset();

        //closing the repoForm
        setPlanForm(false);
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

  return (

    // using classes and ids of reminder create -form
    <form ref={formRef} onSubmit={handleSubmit} className='remForm'>
    <h4 className='remFT'>Create Plan</h4>
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
    <label htmlFor="duration">duration</label>
     <input type="text" name="duration"/>
  </div>
  </div>
  <div className='remInp'>
    <label htmlFor="tag">Tag</label>
    <input type="text" id="tag" name="tag" />
  </div>
  <div>
   <button className='remTCancel remBtn' type='button' onClick={()=>{setPlanForm(false)}}>cancel</button> 
  <button className='remBtn' type="submit">Create</button>
  </div>
</form>
  )
}

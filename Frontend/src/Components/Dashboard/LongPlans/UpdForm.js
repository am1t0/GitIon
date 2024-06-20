import React, { useRef } from 'react'
import getAccessToken from '../../../Utils/auth';

export default function UpdForm({setUpdForm,content,setPlans,plans}) {
    const formRef = useRef();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            duration:formData.get('duration'),
            tag: formData.get('tag')
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/plans/update-plan/${content._id}`, {
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
            // backend response change
            result = result.plan;
    
            //updating state by adding created plans
            setPlans(plans.map((plan)=>{
                // replace the updated plans 
                if(plan._id===result._id)
                    return result;
                
                // all other  plans will be same
                else return plan;
            }));
    
            //clear the form
            formRef.current.reset();
    
            //closing the repoForm
            setUpdForm(false);
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
  return (
    
    // using classes and ids of reminder create -form
    <form ref={formRef} onSubmit={handleSubmit} className='remForm'>
    <h4 className='remFT'>Create Plan</h4>
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
    <label htmlFor="duration">duration</label>
     <input defaultValue={content.duration} type="text" name="duration"/>
  </div>
  </div>
  <div className='remInp'>
    <label htmlFor="tag">Tag</label>
    <input defaultValue={content.tag} type="text" id="tag" name="tag" />
  </div>
  <div>
   <button className='remTCancel remBtn' type='button' onClick={()=>{setUpdForm(false)}}>cancel</button> 
  <button className='remBtn' type="submit">Create</button>
  </div>
</form>
  )
}

import React, { useState } from 'react'
import '../../../Styles/EachPlan.css'
import team from '../../../Images/LandingTeam.png'
import getAccessToken from '../../../Utils/auth';

export default function EachPlan(props) {
  const {plan,plans,setPlans,setPlanSelected,handleMnpShow,mnpOp,upDateClick} = props;
  const [content,setContent] = useState(null);

  // deleting selected plan for deletion
  const handleDeletePlan= async (id)=>{
    try {
       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/plans/delete-plan/${id}`,{
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
       console.log(response);
       let data = await response.json();
       let deletedPlan = data.plan;

       // updating reminder state by removing reminder deleted
       setPlans(plans.filter((plan)=> 
          { return  plan._id!==deletedPlan._id}));

    } catch (error) {
       console.error('Error Deleting  reminder:', error.message);
    }
}
  return (    
    <div class="plan-card">
    <div class="plan-header">   {/* head of the card  */}
    <div>
      <span class="plan-tag">{plan.tag}</span>
      <span className='view' onClick={()=>{setPlanSelected(plan)}}>view</span>
    </div>
      <div>
      <i class="fa-solid fa-ellipsis" id={mnpOp===plan._id?'mnp-2':'mnp'}  onClick={()=>handleMnpShow(plan._id)}></i>   {/* three dots for options to modify plans  */}
      { mnpOp===plan._id &&
      <ul id="mnpOp">       {/* providing options of modifying plan onClicking three dots icon */}
          <li>
          <i class="fa-solid fa-image"></i>
            <span>Set Image</span>
          </li>
          <li onClick={()=> upDateClick(plan)}>
            <i id="upd" class="fa-solid fa-pen-to-square" aria-hidden="true"></i>
             <span>Edit</span>
          </li>
          <li onClick={()=> handleDeletePlan(plan._id)}>
          <i id="del" class="fa-solid fa-trash" aria-hidden="true"></i>
           <span>Delete</span>
           </li>
       </ul>
      }
      <span class="plan-duration">{plan.duration}</span>
      </div>
    </div>
    <div class="plan-image">
      <img src={team} alt={`plan Image`}/>
    </div>
    <div class="plan-progress">
      <div class="loading-bar">
        <div class="progress">
          {/* percentage show krna hai  */}
        {/* <p className="percentage">{plan.progress}</p> */}
        </div>     
      </div>
    </div>
    <section class="plan-content">
      <h6 class="plan-title">{plan.title}</h6>
     
      <p class="plan-description">{plan.description}</p>

    </section>
  </div>
  
  )
}

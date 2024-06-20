import React, { useEffect, useState } from 'react'
import '../../../Styles/LongPlans.css'
import LongPlansList from './LongPlansList'
import Description from '../Description.js'
import CreatePlan from './CreatePlan.js';
import getAccessToken from '../../../Utils/auth.js';
import UpdForm from './UpdForm.js';

export default function LongPlans() {
  //for showing plan create form 
  const [planForm,setPlanForm] = useState(false);

   //for showing plan update form 
   const [updForm,setUpdForm] = useState(false);
   // passing editing plans content to form for it's default value
   const [prevContent,setPrevContent] = useState(null);

   const upDateClick=(plan)=>{
        setUpdForm(true)         // show updating plan form
        setPrevContent(plan);    // default values for updating form
   }


  // containing all plans created
  const [plans,setPlans] = useState([]);
  
  // fetching all plans
  const fetchPlans=async()=>{
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/plans/get-plans`, {
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
      data = data.plans; 
      setPlans(data);

    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  }
  useEffect(()=>{
    fetchPlans();
  },[])
  return (
    <section className='longPlans'>
      <div className="Topic">
           <h2>Yearly Plans</h2>
        </div>

         {/* opening the form for new plan */}
        <div className="addnew" onClick={()=>{setPlanForm(true)}}>
        <i class="fa-solid fa-plus"></i>
        <p>Add</p>
      </div>

      {/* show create plan form  */}

      {
        planForm && <CreatePlan setPlanForm={setPlanForm} setPlans={setPlans} plans={plans}/>
      }

       {/* show update plan form  */}
       {
        updForm && <UpdForm setUpdForm={setUpdForm} content={prevContent} plans={plans} setPlans={setPlans}/>
      }
      {/* intro and options to create a new plan  */}
     
        {/* containing list of all long plans  */}
        <LongPlansList plans={plans} setPlans={setPlans} upDateClick={upDateClick}/>

    </section>
  )
}

import React, { useState } from 'react'
import EachPlan from './EachPlan'
import '../../../Styles/LongPlansList.css'
import DescCreatePlan from '../Description';
import SelectedPlan from './SelectedPlan';

export default function LongPlansList({plans,setPlans,upDateClick}) {
  
         
    const [planSelected,setPlanSelected] = useState(null);  

    const [mnpOp,setMnpOp] = useState(null); // for showing the modifying options for each plan
    

      // setting the id of plan of which modifying options is clicked
  const handleMnpShow=(id)=>{

    if(!mnpOp) setMnpOp(id); // new id seelcted 

    else setMnpOp(null); // already id selected

  }

  return (
     <section className='longPlansList'>
 
      { planSelected &&  <SelectedPlan plan={planSelected} setPlan={setPlanSelected}/>}
         
        {/* for showing list of all long plans  */}
        <div className="planlist">
       {plans?.map((plan)=>{
         return  <EachPlan 
              plan={plan} 
              plans={plans} 
              setPlans={setPlans} 
              setPlanSelected={setPlanSelected}
              handleMnpShow={handleMnpShow}
              mnpOp={mnpOp}
              upDateClick = {upDateClick}
              />
       })}
        </div>
     </section>
  )
}

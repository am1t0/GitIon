import React from 'react'
import '../../../Styles/SelectedPlan.css';
import team from '../../../Images/LandingTeam.png'


const SelectedPlan = ({plan ,setPlan}) => {
    
    return (


        <section className='selectedPlan'>
             
             <div onClick={()=> setPlan(null)} className='clse'>
              <button>close</button>
            </div>
             
             <h6 id='spln'>Selected Plan</h6>
            <div className="plnImg">
                <img src={team} alt="" />
            </div>

            <div className="plnPart">
                <h6>Title</h6>
                <p>{plan.title}</p>
            </div>
            <div className="plnPart">
                <h6>Tag</h6>
                <p>{plan.tag}</p>
            </div>
            <div className="plnPart">
                <h6>Duration</h6>
                <p>{plan.duration}</p>
            </div>
            <div className="plnPart">
                <h6>Description</h6>
                <p>{plan.description} </p>
            </div>
            <div class="plan-progress">
                <div class="loading-bar">
                    <div class="progress">
                    </div>
                </div>
            </div>

             <div  id='mlst'>
              <h6>Milestones</h6>
            <div className="plan-milestones">
                {
                    plan?.milestones?.map((milestone) => {
                        return <div className='milestone'>
                            <input type="checkbox" id='milestone' />
                            <p>{milestone}</p>
                        </div>
                    })
                }
            </div>
             </div>
        </section>
    )
}

export default SelectedPlan

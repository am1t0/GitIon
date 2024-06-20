import React from 'react'
import Todo from './Todo/Todo'
import LongPlans from './LongPlans/LongPlans'
import Reminders from './Reminders/Reminders'
import '../../Styles/Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
       <Todo/>
      <Reminders/>
       <LongPlans/>
    </div>
  )
}

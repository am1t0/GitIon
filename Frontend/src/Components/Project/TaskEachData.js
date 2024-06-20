import React from 'react'
import '../../Styles/TaskEachData.css'

export default function TaskEachData({detail,value,d}) {
  return (
    <div className='dt'><i className={d}></i><p>{detail}</p> <p id='value'>{value}</p></div> 
  )
}

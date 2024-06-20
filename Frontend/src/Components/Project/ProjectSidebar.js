import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProjectSidebar({setContent }) {
  const {data} = useSelector((store)=> store.currProject);

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <i className="fab fa-github"></i>
          <span>Gittion</span>
        </div>
        <ul className="projSList">
           <li className='navOP'>
              <Link to={`/project/${data?.name}/${data?._id}/details`}>
              <i class="fa-solid fa-diagram-project"></i>
             <h6>Details</h6>
              </Link>
            </li>
            <li className='navOP'>
               <Link to={`/project/${data?.name}/${data?._id}/tasks`}>
               <i class="fa-solid fa-bars-progress"></i>
               <h6>Tasks</h6>
              </Link>
            </li>
            <li className='navOP'>
            <Link to={`/project/${data?.name}/${data?._id}/docs`}>
            <i class="fa-solid fa-book"></i>
            <h6>Document</h6>
            </Link>
            </li>
        </ul>
      </div>
    </>
  )
}

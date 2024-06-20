import React, { useEffect, useState } from 'react'
import { Outlet,useLocation, useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import ProjectSidebar from './ProjectSidebar'
import ProjectIntro from './ProjectIntro';
import ProjectTasks from './ProjectTasks';
import ProjectDocs from './ProjectDocs';
import { fetchCurrProject } from '../../Data_Store/Features/currProjectSlice';
import { fetchData } from '../../Data_Store/Features/repoContentSlice';
import { fetchMemberDetails } from '../../Data_Store/Features/memberSlice';
import { fetchTasks } from '../../Data_Store/Features/projectTasksSlice';

export default function Project() {
    
    const [content,setContent] = useState('Documents')
    const dispatch = useDispatch();
    const {projectId} = useParams();
    const repodata = useSelector((store)=> store.repo);
    const selectedBranch = localStorage.getItem('selectedBranch');

    const owner = localStorage.getItem('owner');
    const repoName = localStorage.getItem('repoName');
    const repo = {owner,repoName};
    
    useEffect(()=>{
      dispatch(fetchCurrProject(projectId));
    },[projectId])

    useEffect(()=>{
       dispatch(fetchData({project:{repo},selectedBranch}))
    },[projectId])

  

    return ( repodata && 
    <div style={{display:'flex'}}>
      <ProjectSidebar setContent={setContent}/>
      <Outlet/>
    </div>
  )
}
import React, { useEffect,useState } from 'react'
import getAccessToken from '../../Utils/auth';
import { useDispatch, useSelector } from 'react-redux';
import InitialPushinComands from '../InitialPushinComands';
import PullRequestForm from '../PullRequestForm';
import RepoFileFolder from '../RepoFileFolder';
import '../../Styles/ProjectDocs.css'
import { Link, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { fetchBranches } from '../../Data_Store/Features/branchSlice';

export default function ProjectDocs() {

  // const currProject = useSelector((store)=>store.currProject.data);
  const {projectName} = useParams();
  const {projectId} = useParams();
  const repoName = localStorage.getItem('repoName');
  const owner = localStorage.getItem('owner');

  const dispatch = useDispatch();

  // fetching branches detail 
  useEffect(()=>{
      dispatch(fetchBranches({project:{repo:{owner,repoName}}}));
      console.log('branches mangwayii hai...')
  },[])

  return (
    <div id='projectDocs'> 
     <div className="projectHead">
      <h1>{projectName}</h1>
      <h5>{repoName}</h5>
     </div>
     <div className="repoCodePullReq">
           <button className='repoTopBtn'>
           <i class="fa-solid fa-code"></i>
             <p> <Link to={`/project/${projectName}/${projectId}/docs`}>Code</Link> </p>
           </button>
           <button className='repoTopBtn'>
           <i class="fa-solid fa-code-pull-request"></i>
             <p><Link to={`/project/${projectName}/${projectId}/docs/pulls`}>Pull requests</Link></p>
           </button>
      </div>
      <Outlet/>
    </div>
  );
}
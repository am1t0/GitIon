import React, { useEffect ,useState} from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import "../../Styles/TeamSidebar.css"

export default function TeamSidebar({setShow}) {
  const navigate = useNavigate();

  // getting team id and name from routed link
  const {teamId,teamName} = useParams();

  // projects data from projects slice
  const projects = useSelector((store)=> store.project);

  // user from user slice
  const {data} = useSelector((store)=> store.user);
  const user = data;

  const handleProjectClick=(project)=>{
        
        const {repo} = project;
        localStorage.setItem("owner",repo.owner);
        localStorage.setItem("repoName",repo.repoName);
        localStorage.setItem("selectedBranch",'main');
        navigate(`/project/${project.name}/${project._id}`)
  }

   
  return(
    <div className="sidebar">
    <div className="logo">
      <i className="fab fa-github"></i>
      <span>Gittion</span>
    </div>
    <ul className="list-unstyled my-4">
    <li>
        <button className="custom btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#user-collapse" aria-expanded="false">
          <div id="user">
          <i class="fa-solid fa-circle-user"></i>
          <h6>User</h6>
          </div>
        </button>
        <div className="collapse" id="user-collapse">
          <ul className="list-unstyled pos">
            <li>
              <Link to={`/profile/${user?.fullname}`} className='link'>       {/* navigating to the profile of user  */}
              <i class="fa-solid fa-user"></i>
                <p>profile</p>
              </Link>
            </li>
            <li>
              <Link to="/" className='link'>
              <i class="fa-solid fa-gear"></i>
              <p>setting</p>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className='link'>           {/* navigating to the todos of user  */}
              <i class="fa-regular fa-circle-dot"></i>
              <p>dashboard</p>
              </Link>
            </li>
            <li>
              <Link to="/" className='link'>
              <i class="fa-solid fa-right-from-bracket"></i>
              <p>log out</p>
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <button className="custom btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#team-collapse" aria-expanded="false">
          <h6>Projects</h6>
        </button>
        <div className="collapse" id="team-collapse">
          <ul className="pos list-unstyled">
            <li>
              <button className="teams btn btn-toggle align-items-center rounded collapsed mx-1" data-bs-toggle="collapse" data-bs-target="#teams-collapse" aria-expanded="false">
              <i class="fa-solid fa-p"></i>
              <p>Your Projects</p>
              </button>
              <div className="collapse" id="teams-collapse">
                <ul className="pos list-unstyled">
                  {projects.data?.map((project) => (
                    <li onClick={() => handleProjectClick(project)} key={project?._id}  className='teamName'>{project?.name}</li>
                  ))}
                </ul>
              </div>
            </li>

            
            <li>
              <Link
                to={`/${teamId}/${teamName}/create-project`}
                 className='link'      >  
                  <i class="fa-solid fa-monument"></i>
                   <p>Create Project</p>
                </Link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
  )
}

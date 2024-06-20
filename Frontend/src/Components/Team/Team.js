import React from 'react'
import TeamSidebar from './TeamSidebar.js'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import { useState,useEffect } from 'react';
import getAccessToken from '../../Utils/auth.js';
import "../../Styles/Team.css"
import { fetchProjects } from '../../Data_Store/Features/projectSlice.js';
import { fetchCurrTeam } from '../../Data_Store/Features/currTeamSlice.js';
import TeamIntro from './TeamIntro.js';
import CreateTeam from './CreateTeam.js';
import { fetchMemberDetails } from '../../Data_Store/Features/memberSlice.js';
import CreateProject from '../Project/CreateProject.js';

export default function Team() {

  
  const  dispatch = useDispatch();
  const {teamId} = useParams();
  const [show,setShow] = useState(true);

  useEffect(()=>{

    // Fetching all projects for current project
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${""}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
    
        const data = await response.json();
        console.log('user data is ',data)
      } catch (error) {
        
      }
    };

    fetchUserData();
    
     dispatch(fetchProjects(teamId));

    // Fetching current  team details
     dispatch(fetchCurrTeam(teamId));

     // Fetching members details
     dispatch(fetchMemberDetails(teamId));
  },[teamId])


  // useEffect(()=>{
  //    console.log('teamName yha hai ',teamName)
  // })
  // const handleDeleteTeam=async (teamId)=>{
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/remove/${currTeam._id}`, {
  //       method: 'DELETE',  // Adjust the method and endpoint based on your API
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${getAccessToken()}`
  //       },
  //     });

  //     if (!response.ok) {
  //       console.error('Error:', response.statusText);
  //       return;
  //     }
  //     const data = await response.json();
  //     //console.log("This is data of Projects on Team ",data.data);
  //     navigate('/Home')

  //   } catch (error) {
  //     console.error('Error deleting teams:', error.message);
  //   }

  // }

  // useEffect(() => {
  //   const fetchProjectNames = async () => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/projects/${team._id}`, {
  //         method: 'GET',  // Adjust the method and endpoint based on your API
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${getAccessToken()}`
  //         },
  //       });

  //       if (!response.ok) {
  //         console.error('Error:', response.statusText);
  //         return;
  //       }
  //       const data = await response.json();
  //       //console.log("This is data of Projects on Team ",data.data);
  //       setProject(data.data);  
  //     } catch (error) {
  //       console.error('Error fetching project names:', error.message);
  //     }
  //   };

  //   fetchProjectNames();
  // }, []);  
  
  return (
    <div className='Team'>
     <TeamSidebar setShow={setShow}/>
     <Outlet/>
     </div> 
  )
}
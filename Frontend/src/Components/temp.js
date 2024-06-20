// import React, { useRef, useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import '../../Styles/Branch.css'
// import { fetchBranches } from '../../Data_Store/Features/branchSlice';
// import Project from '../Project/Project';
// // import fetch from 'node-fetch';

// export default function Branches({handleBranchChange, selectedBranch}) {

//   const createdBranch = useRef();
//   const owner = localStorage.getItem('owner');
//   const repoName = localStorage.getItem('repoName');
//   const branches = useSelector((store)=>store.branches.data)
//   const [creatingBranch, setCreatingBranch] = useState(false);


//   const handleBranchCreate = async () => {
//     const newBranchName = createdBranch.current.value;
//     createdBranch.current.value = '';
//     if (newBranchName) {
//       setCreatingBranch(true);
  
//       const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/git/refs`;
//       const baseBranch = selectedBranch;

//       const createBranchBody = {
//         ref: `refs/heads/${newBranchName}`,
//         sha: (await getBranchSha(owner, repoName, baseBranch,localStorage.getItem("leaderToken"))).object.sha,
//       };

   
//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${""}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(createBranchBody),
//         });

//         if (response.ok) {
//           /// isme jb tak response ni aata tb tak kro---> 
//             // window.location.reload();
//             alert('successful');
//             console.log('hogay username dekh')
//         } else {
//           console.error(`Failed to create branch. Status: ${response.status}`);
//         }
//       } catch (error) {
//         console.error('Error creating branch:', error);
//       } finally {
//         setCreatingBranch(false);
//       }
//     }
//   };

//   const getBranchSha = async (owner, repo, branch, token) => {

//     const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${selectedBranch}`;
//     try {
//       const response = await fetch(apiUrl, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         return response.json();
//       } else {
//         console.error(`Failed to get branch SHA. Status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error getting branch SHA:', error);
//     }
//   };

//   return (
//     <div className='branch-main'>
//       <div id='cre-len'>
//         <div id="branchInp">
//           <input type="text" placeholder={`create branch from ${selectedBranch}`} ref={createdBranch} />
//           <button onClick={handleBranchCreate}>
//           <i className="fa-solid fa-plus"></i>
//           </button>
//         </div>
  
//        {creatingBranch && <h6 id='createBranch'>Creating branch...</h6>}
//       </div>
  
//     <div id='branch'>
//       <div className="branchNames">
//       <div className="branchLogo">
//       <i className="fa-solid fa-code-branch my-2"></i>
//         </div>
//       <select value={selectedBranch} id="branchSelect" onChange={handleBranchChange}>
//         {branches?.map((branch) => (
//           <option key={branch?.name} value={branch?.name}>
//             {branch?.name}
//           </option>
//         ))}
//       </select>
//       </div>
//       <div id="branchNum">
//         <div className="branchLogo">
//       <i className="fa-solid fa-code-branch my-1"></i>
//         </div>
//       <>
//           {branches?.length} Branch
//       </>
//       </div>
//     </div>
//   </div>
  
//   );
// }


// import React, { useEffect, useRef, useState } from 'react'
// import '../../Styles/NewPullReqForm.css'

// export default function NewPullReqForm({base,head}) {

//   const titleRef = useRef(null);
//   const bodyRef = useRef(null);
//   const [message, setMessage] = useState('');

//   const owner = localStorage.getItem('owner');
//   const repoName = localStorage.getItem('repoName');
//   const token = localStorage.getItem('leaderToken');

//   const handlePullReqSubm = async (e) => {
//     e.preventDefault();

//     const title = titleRef.current.value;
//     const body = bodyRef.current.value;

  

//     const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${""}`,
//         'Accept': 'application/vnd.github.v3+json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         title,
//         head,
//         base,
//         body,
//       })
//     });

//     const data = await response.json();
//     console.log('response ka data after pull request ',data)

//     if (response.ok) {
//       alert(`Pull request created successfully: #${data.number} - ${data.title}`);
//     } else {
//       alert(`Failed to create pull request: ${data.message}`);
//     }
//   };

//   return (
//       <form className='pullForm' onSubmit={handlePullReqSubm}>
//         <div className='pullInps'>
//           <label>Add a title</label>
//           <input
//             type="text"
//             ref={titleRef}
//             required
//           />
//         </div>
//         <div className='pullInps'>
//           <label>Add a description</label>
//           <textarea
//             ref={bodyRef}
//           />
//         </div>
//         <button type="submit">Create Pull Request</button>
//       </form>
//   )
// }

// import React from 'react'
// import TeamSidebar from './TeamSidebar.js'
// import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
// import {useDispatch, useSelector} from 'react-redux';
// import { useState,useEffect } from 'react';
// import getAccessToken from '../../Utils/auth.js';
// import "../../Styles/Team.css"
// import { fetchProjects } from '../../Data_Store/Features/projectSlice.js';
// import { fetchCurrTeam } from '../../Data_Store/Features/currTeamSlice.js';
// import TeamIntro from './TeamIntro.js';
// import CreateTeam from './CreateTeam.js';
// import { fetchMemberDetails } from '../../Data_Store/Features/memberSlice.js';
// import CreateProject from '../Project/CreateProject.js';

// export default function Team() {

  
//   const  dispatch = useDispatch();
//   const {teamId} = useParams();
//   const [show,setShow] = useState(true);

//   useEffect(()=>{

//     // Fetching all projects for current project
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('https://api.github.com/user', {
//           headers: {
//             Authorization: `token ${""}`,
//           },
//         });
    
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
    
//         const data = await response.json();
//         console.log('user data is ',data)
//       } catch (error) {
        
//       }
//     };

//     fetchUserData();
    
//      dispatch(fetchProjects(teamId));

//     // Fetching current  team details
//      dispatch(fetchCurrTeam(teamId));

//      // Fetching members details
//      dispatch(fetchMemberDetails(teamId));
//   },[teamId])


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
  
//   return (
//     <div className='Team'>
//      <TeamSidebar setShow={setShow}/>
//      <Outlet/>
//      </div> 
//   )
// }
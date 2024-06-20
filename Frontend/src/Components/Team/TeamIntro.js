import React, { useState,useEffect, useRef } from 'react'
import "../../Styles/TeamIntro.css"
import getAccessToken from '../../Utils/auth.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberDetails, setMemberRole } from '../../Data_Store/Features/memberSlice.js';
import membAdd from "../../Sound/membAdd.wav"
import empty from '../../Images/empty.png'
import { Link, useNavigate, useParams } from 'react-router-dom';


export default function TeamIntro() {

  // getting team id and name from url
   const {teamId,teamName} = useParams();
   
  // getting the user from store
   const team = useSelector((store)=>store.currTeam.data);

   // all members data
   const [members,setMembers] = useState();
   const [isLoading,setIsLoading] = useState(false);

     // projects data from projects slice
  const projects = useSelector((store)=> store.project);
   
   // user details
   const user = useSelector((store)=> store.user.data);

  // state variable for the storing details of each member
  const [member,setMember] = useState([]);
  const [arrow, setArrow] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [role,setRole] = useState('');  // for role of member
  const [show,setShow] = useState(null); // showing options on clicking on dots of each member
  const [roleShow,setRoleShow] = useState(null) // for showing input box for role change

  const [placeholders,setPlaceholders] = useState(0)

  // for navigating programmatically
  const navigate = useNavigate();
  const usernameRef = useRef();
  const audioRef = useRef();
  const optionsRef = useRef();      // for keeping track of options opening closing



  useEffect(() => {
    const getAdmin = () => {
      let adminMember = null;

      members?.forEach(member => {
        if (team?.owner === member._id) {
          adminMember = member;
        }
      });

      return adminMember;
    };

    // Execute the getAdmin function and set the result to the admin state
    setAdmin(getAdmin());
  }, [members]); 

  // fetching member details
  useEffect(()=>{
     fetchMemberDetails(teamId);
  },[])

  const handleChangeRole=(memberId)=>{
        setRoleShow(roleShow=>roleShow===memberId?null:memberId); // for showing input box for role change
  }
  const fetchMemberDetails  = async (teamId) => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/members/${teamId}`, {
          method: 'GET',  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        });

        if (!response.ok) {
          return  Promise.reject(response);
        }
       const res = await response.json();

       setMembers(res.data);

       const Placeholderlength = 5-res.data.length;

       setPlaceholders(Placeholderlength>=0?Placeholderlength:0);

       setIsLoading(false);

        
      } catch (error) {
        return  error.message || "An error occurred while loading";
      }
}

 // for setting role of a member in a team 
  const handleRoleSet = async (memberId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/setRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          teamId,
          memberId,
          role
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to set role: ${errorMessage}`);
      }
  
      const result = await response.json();
      const roleGiven = result.data.role;

      setMembers(members => {
        return members.map((member)=>{
           if(member._id===memberId) 
             return {...member,role:roleGiven}
           else 
             return member; 
        })
      })

    } catch (error) {
      console.error('Error setting role:', error.message);
    }
  };

  // showing text of cancelling and setting role based on what member selected for setting
  const setOrCancelRole=(memberId)=>{
      return memberId===roleShow?'cancel':'set role';
  }

  // for storing the newly added member always at second position as first place is for admin
  const addMemberAtSecondPosition = (addedMember, members) => {
    return [members[0], addedMember, ...members.slice(1)];
  };
  const handleAddMember= async () =>{
    try{
        let username = usernameRef.current.value;

        if(!username) return  alert("Username can't be empty");

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/add-members`,{
          method: 'POST',
          body:JSON.stringify({
            username:username ,
            teamId: team._id
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        })
        
        if (!response.ok) {
          console.error('Error:', response.statusText);
          return;
        }
        const responseJson = await response.json();
        const addedMember = await responseJson.data;

        setMembers(members=> addMemberAtSecondPosition(addedMember,members));
        
        // playing add sound on member successfully addition
        audioRef.current.play();

        usernameRef.current.value ='';
        
       } catch (error) {
        console.error('Error in showing members of teams:', error.message);
       }
  }

  const handleRemoveMember= async (memberId) =>{
       try {
         const response  = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/remove-members`,{
          method: 'POST',
          body:JSON.stringify({
            memberId : memberId,
            teamId: team._id
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        })

        if (!response.ok) {
          console.error('Error:', response.statusText);
          return;
        }

        // filetering out removed member
        setMembers((members)=>
          members.filter((member)=> member._id!==memberId))

        console.log('member removed successfully!')
       } catch (error) {
        console.log("error in removing member : ",error)
       }
  }

  function getUserColor(user) {
    // Convert user's unique identifier (e.g., ID, username, or email) to a numeric hash
    let hash = 0;
    for (let i = 0; i < user.length; i++) {
      hash = user.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to a hexadecimal color code
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
  }

  const nameLogo = (name) => {
    return name[0].toUpperCase() + name.split(' ')[1][0].toUpperCase();
  }
  const handleProjectClick=(project)=>{
        
    const {repo} = project;
    localStorage.setItem("owner",repo.owner);
    localStorage.setItem("repoName",repo.repoName);
    localStorage.setItem("selectedBranch",'main');
    navigate(`/project/${project.name}/${project._id}`)
}

const handleShow = (memberId)=>{
   setShow(show=> show===memberId?null:memberId)
}
// checking if click is made outside box
const handleClickOutside = (event) => {
  if (optionsRef.current && !optionsRef.current.contains(event.target)) {
    setShow(null);
    setRoleShow(null);
  }
};
// for closing the boxes if clicked outside of them
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className='team-intro'>
      {
    team ?
    <div  className="team">
        <div id="intro-memb">
          <div id="intro">
            <h4 >Meet the team {team?.name}!</h4>
            {/* <h6>{team?.description}</h6> */}
          </div>
          <div id="memb">
            <div id="search-add">
              <div className='sa'>
              <input type="search" placeholder='Search team members' required/>
              <div className="saLogo">
              <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              </div>
              { 
              // (user?._id===team?.owner) &&
              <div className='sa'>
              <input  type="search" ref={usernameRef}  placeholder='Enter username to add' />
              <div className="saLogo" onClick={handleAddMember} >
               <i className="fa-solid fa-plus"></i>
               <audio ref={audioRef} src={membAdd}/>
              </div>
              </div>
              }
            </div>

            <div id="teamMemb">
              { !member && (
            <p>No team members found.</p>
            )}
              
              {!isLoading  ? <div id="members">
                <h5>Team Members</h5>
              <div>
                {
                  members?.map((member)=>{
                  return <div id='eachMemb'>
                    <div className="logo-name">
                    <Link to={`/profile/${member.username}`}>
                       <div className="circle" style={{ background: getUserColor(member.username) }}>
                          {nameLogo(member.fullname)}
                        </div>
                        <p>{member.fullname}</p>
                      </Link>
                     </div>
                       <div>
                        { 
                        //  showing input for role setting or the role
                          !member.role||(roleShow===member._id)? 
                           <div id='roleInp'>  
                            <input type="text" placeholder='Set role' onChange={(e)=> setRole(e.target.value)}/>
                            <button onClick={()=>handleRoleSet(member._id)}>set</button>
                          </div>
                           :<p className='role'>{member.role}</p>
                        }
                       </div>

                     {/* dots for modification of members */}
                     <div className="membMnp">
                      <i class="fa-solid fa-ellipsis" onClick={()=> handleShow(member._id)}></i>
                      </div>
                     {/* options of modification some portion visible to leader/owner only */}
                  <div>{  show===member._id &&
                       <div className="updMemb" ref={optionsRef}>
                        <p><Link to={`/profile/${member.username}`}>Profile</Link></p>

                        {/* options visible to leader/admin only  */}
                        {(team.owner===user._id) &&
                        <>
                        {/* removing member from team  */}
                        <p onClick={()=> handleRemoveMember(member._id)}>Remove</p>
                        {/* whether to set or cancel the role setting */}
                        <p onClick={()=> handleChangeRole(member._id)}>{setOrCancelRole(member._id)}</p>   
                        </>
                        }
                    </div>
                  }</div>
                    </div>

                 })
                }
                  <section className="moreMemb">
                    <h5>Add members</h5>
                  </section>
              </div>    
              </div> : <div className='loading'><div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div></div> }
            </div>
          </div>
        </div>
       
    </div> : <h1>Loading...</h1>
    }
     <div className="projects">
       <div className="prCr">
         <h5>Team Projects</h5>
         <Link to={`/${teamId}/${teamName}/create-project`}><button>Create</button></Link>
       </div>

       <div className="srchProj">
         <input type="search" placeholder='search project'/>
       </div>

        <div className="projList">
        { projects.data.length>0 ?
          projects.data.map((project)=>{
            return <li onClick={()=>{handleProjectClick(project)}}>{project.name}</li>
          })
          :<div class="empty-state">
          <h5>No Projects Yet</h5>
          <p>Click the button below to add your first project.</p>
          <button onclick="openNewProjectModal()">Create New Project</button>
      </div>
        }
         </div>
    </div> 
    </section>
  )
}

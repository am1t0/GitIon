import React, { useState, useEffect, useRef } from 'react'
import "../../Styles/ProjectIntro.css"
import getAccessToken from '../../Utils/auth.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberDetails, setMemberRole } from '../../Data_Store/Features/memberSlice.js';
import membAdd from "../../Sound/membAdd.wav"
import empty from '../../Images/empty.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchUser from './SearchUser.js';
import NoCollaborator from '../EmptyCases/NoCollaborator.js';
import LessCollaborators from '../EmptyCases/LessCollaborators.js';


export default function ProjectIntro() {

  // getting project id and name from url
  const { projectId, projectName } = useParams();

  // // getting the curr project from store
  const project = useSelector((store) => store.currProject.data);

  // all members data
  const [members, setMembers] = useState();
  const [isLoading, setIsLoading] = useState(false);


  // user details
  const user = useSelector((store) => store.user.data);

  const [addUser, setAddUser] = useState();
  // state variable for the storing details of each member
  const [member, setMember] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState('');  // for role of member
  const [show, setShow] = useState(null); // showing options on clicking on dots of each member
  const [roleShow, setRoleShow] = useState(null) // for showing input box for role change

  const [placeholders, setPlaceholders] = useState(0);

  const audioRef = useRef();
  const optionsRef = useRef();      // for keeping track of options opening closing

  useEffect(() => {
    const getAdmin = () => {
      let adminMember = null;

      members?.forEach(member => {
        if (project?.owner === member._id) {
          adminMember = member;
        }
      });

      return adminMember;
    };

    // Execute the getAdmin function and set the result to the admin state
    setAdmin(getAdmin());
  }, [members]);

  // fetching member details
  useEffect(() => {
    fetchMemberDetails(projectId);
  }, [])

  const handleChangeRole = (memberId) => {
    setRoleShow(roleShow => roleShow === memberId ? null : memberId); // for showing input box for role change
  }
  const fetchMemberDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/members/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      });

      if (!response.ok) {
        return Promise.reject(response);
      }
      const res = await response.json();

      setMembers(res.data);

      const Placeholderlength = 5 - res.data.length;

      setPlaceholders(Placeholderlength >= 0 ? Placeholderlength : 0);

      setIsLoading(false);


    } catch (error) {
      return error.message || "An error occurred while loading";
    }
  }

  // for setting role of a member in a team 
  const handleRoleSet = async (memberId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/setRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          projectId,
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
        return members.map((member) => {
          if (member._id === memberId)
            return { ...member, role: roleGiven }
          else
            return member;
        })
      })
    } catch (error) {
      console.error('Error setting role:', error.message);
    }
    finally {
      setRoleShow(false)
    }
  };

  // showing text of cancelling and setting role based on what member selected for setting
  const setOrCancelRole = (memberId) => {
    return memberId === roleShow ? 'cancel' : 'set role';
  }

  // for storing the newly added member always at second position as first place is for admin
  const addMemberAtSecondPosition = (addedMember, members) => {
    return [members[0], addedMember, ...members.slice(1)];
  };

  // Function to send an invitation
  const owner = localStorage.getItem('owner')
  const repo = localStorage.getItem('repoName')
  const token = localStorage.getItem('leaderToken')

  const sendInvitation = async (username) => {
    console.log('inviation dene ki taiyarriii..')
    const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        console.log('Invitation sent successfully:', response);
        return true

      } else {
        const errorData = await response.json();
        console.error('Error sending invitation:', errorData);
      }
    } catch (error) {
      console.log('error occured ', error)
      return false;
    }
  };
  const handleAddMember = async (username) => {

    try {
      if (!username) return alert("Username can't be empty");

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/add-members`, {
        method: 'POST',
        body: JSON.stringify({
          username,
          projectId
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      })

      if (response.ok) {
        const responseJson = await response.json();
        const addedMember = await responseJson.data;

        console.log('added member successfully in our database', addedMember);

        const result = await sendInvitation(username);

        if (result) {
          setMembers(members => addMemberAtSecondPosition(addedMember, members));

          // playing add sound on member successfully addition
          audioRef.current.play();
        }
        else {
          console.log('Error occured while sending invitation');
          console.log('database me se hta us member ko ab');
        }
      }
      else {
        console.error('Error:', response.statusText);
      }

    } catch (error) {
      console.error('Error in showing members of teams:', error.message);
    }
  }


  // Function to remove a collaborator
  const removeCollaborator = async (username, memberId) => {
    const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`Collaborator ${username} removed successfully.`);
        console.log('now removing from our project')
        await handleRemoveMember(memberId)
      } else {
        const errorData = await response.json().catch(() => null); // Parse JSON if possible
        console.error('Error removing collaborator:', errorData || response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/remove-member`, {
        method: 'DELETE',
        body: JSON.stringify({
          memberId,
          projectId
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
      setMembers((members) =>
        members.filter((member) => member._id !== memberId))

      console.log('member removed successfully!')
    } catch (error) {
      console.log("error in removing member : ", error)
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

  const handleShow = (memberId) => {
    setShow(show => show === memberId ? null : memberId)
  }
  // checking if click is made outside box
  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShow(null);
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
        project && members ?
          <div className="team">
            <div id="intro-memb">
              <div id="intro">
                <h4 >Welcome to {projectName}</h4>
                <p>{project.description} Lorem ipsum dolor sit amet.</p>
                {/* <h6>{team?.description}</h6> */}
              </div>
              <div id="memb">
                <div id="search-add">
                  <div className='sa'>
                    <input type="search" placeholder='Search team members' required />
                    <div className="saLogo">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </div>

                  {/* searching and adding option only to owner  */}
                  {user._id === project.owner &&
                    <>
                      <SearchUser addInvite={handleAddMember} remove={removeCollaborator} />
                      <audio ref={audioRef} src={membAdd} />
                    </>
                  }

                </div>
                <div className="headMembList">
                  <h5>Project Members</h5>
                </div>

                <div id="teamMemb">
                  {!isLoading ? <div id="members">
                    <div>
                      {
                        members?.map((member) => {
                          return <div id='eachMemb' key={member._id}>
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
                                // member has accepted invitation or not
                                member.isAccepted || project.owner === member._id ? (
                                  // showing input for role setting or the role
                                  (!member.role || roleShow === member._id) ? (
                                    <div id='roleInp'>
                                      <input
                                        type="text"
                                        placeholder='Set role'
                                        onChange={(e) => setRole(e.target.value)}
                                      />
                                      <button onClick={() => handleRoleSet(member._id)}>set</button>
                                    </div>
                                  ) : (
                                    <p className='role'>{member.role}</p>
                                  )
                                ) : <h6>pending request</h6>
                              }
                            </div>

                            {
                              /* dots for modification of members */
                              (member.isAccepted || project.owner === member._id) && (
                                <div className="membMnp">
                                  <i className="fa-solid fa-ellipsis" onClick={() => handleShow(member._id)}></i>
                                  {
                                    /* options of modification some portion visible to leader/owner only */
                                    show === member._id && (
                                      <div className="updMemb" ref={optionsRef}>
                                        <p>
                                          <Link to={`/profile/${member.username}`}>Profile</Link>
                                        </p>
                                        {
                                          /* options visible to leader/admin only */
                                          project.owner === user._id && (
                                            <>
                                              {/* removing member from team */}
                                              <p onClick={() => removeCollaborator(member.username, member._id)}>Remove</p>
                                              {/* whether to set or cancel the role setting */}
                                              <p onClick={() => handleChangeRole(member._id)}>{setOrCancelRole(member._id)}</p>
                                            </>
                                          )
                                        }
                                      </div>
                                    )
                                  }
                                </div>
                              )
                            }

                          </div>
                        })
                      }
                    </div>
                  </div> : <div className='loading'><div class="spinner-border text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div></div>}
                </div>
                 
             {
              members?.length===1 &&  <NoCollaborator/>
             } 
             {
              (members?.length<=4 && members?.length>1) && <LessCollaborators/>
             }  

              </div>

              <div>
              </div>
            </div>

          </div> : <h1>Loading...</h1>
      }
    </section>
  )
}

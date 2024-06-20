import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import getAccessToken from '../../Utils/auth';

export default function Notifications() {
    // user's data from store
    const user = useSelector((store)=> store.user.data);

    //invitations 
    const [invitations,setInvitations] = useState([])

    useEffect(()=>{
        const fetchPendingInvitations = async (userToken) => {
          const url = 'https://api.github.com/user/repository_invitations';
        
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `token ${userToken}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
         
            if (response.ok) {
              const data = await response.json();
              setInvitations(data)
            } else {
              const errorData = await response.json().catch(() => null);
              console.error('Error fetching pending invitations:', errorData || response.statusText);
              return null;
            }
          } catch (error) {
            console.error('Error:', error);
            return null;
          }
        };
        fetchPendingInvitations(user.gitToken);
      },[])

    //accepting request send for collaborationa and then
    const acceptInvitation=async(invitation)=>{
      try {
        const response = await fetch(`https://api.github.com/user/repository_invitations/${invitation.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${user.gitToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error accepting invitation: ${response.statusText}`);
        }
        console.log('Invitation accepted');
    } catch (error) {
        console.error(error);
    }
    }

    // making this user a member of project by changing isAccepted attribute
    const makeUserMember = async (invitation) => {
      const owner = invitation.inviter.login;
      const repoName = invitation.repository.name;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/member-accepted`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
          body:JSON.stringify({ owner,repoName})
        });
     
        if (response.ok) {
          console.log('successfully added ');
          console.log('now making github request')
          await acceptInvitation(invitation);  // Call acceptInvitation here
        } 
        else{
          console.log('error in adding ',response)
        }

      } catch (error) {
        console.error('Error:', error);
      }
  };

  // declining request send for collaborationa and then
  const declineInvitation = async (invitation) => {
    try {
        const response = await fetch(`https://api.github.com/user/repository_invitations/${invitation.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${user.gitToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error declining invitation: ${response.statusText}`);
        }

        console.log('Invitation declined');
        console.log('now removing the user from project ')
        await removeUserFromProject(invitation)
    
    } catch (error) {
        console.error('Error declining invitation:', error);
    }
};
  
// after declination of collaboration removing him permanenetly from project
  const removeUserFromProject= async(invitation)=>{
    const owner = invitation.inviter.login;
    const repoName = invitation.repository.name;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/member-declined`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body:JSON.stringify({ owner,repoName})
      });
   
      if (response.ok) {
          console.log('user removed successfully ',response);
      } 
      else{
        console.log('error in removing',response)
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  return (
    <div className="notifications">
    <h5>Notifications</h5>
       <section className="collaborations">
        <h6>Invites</h6>
        <ul>{
            invitations.map((invitation)=>(
              <div 
               key={invitation.id} 
               className='eachInv'
              >
                <p>Invitation to join {invitation.repository.full_name} from {invitation.inviter.login}</p>
                <button className='btn btn-primary mx-2' onClick={()=> makeUserMember(invitation)}>accept</button>
                <button className='btn btn-danger mx-2'  onClick={()=> declineInvitation(invitation)}>decline</button>
              </div>
            ))
            }
        </ul>
       </section>
  </div>
  )
}

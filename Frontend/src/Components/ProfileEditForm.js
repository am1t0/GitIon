import React, { useRef } from 'react'
import '../Styles/ProfileEditForm.css';
import getAccessToken from '../Utils/auth';
import { fetchUser } from '../Data_Store/Features/userSlice';

export default function ProfileEditF({setEditForm,username,setUser}) {
    let name = useRef();
    let phone = useRef();
    let address = useRef();
    let collgN = useRef();
    let collgA = useRef();
    let skills = useRef();
    let github = useRef();
    let linkedin = useRef();

    const handleSubmit = async () => {
      const updatedData = {
          name: name?.current?.value,
          phone: phone?.current?.value,
          address: address?.current?.value,
          collgA: collgA?.current?.value,
          collgN: collgN?.current?.value,
          github: github?.current?.value,
          linkedin: linkedin?.current?.value
      };
  
      try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-user/${username}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${getAccessToken()}`
              },
              body: JSON.stringify(updatedData),
          });
  
          if (!response.ok) {
              throw new Error('Failed to update profile');
          }
  
          const data = await response.json();
  
           window.location.reload();

          setEditForm(false);
  
          // Optionally, you can return a success message
          return "Profile updated successfully";
      } catch (error) {
          console.error(error);
          return "Error occurred while updating profile!";
      }
  }
  
    
  return (
    <div className="prf">
    <form onSubmit={handleSubmit} className='prf-frm'>
        <div className="edi-c">
          <h3>Edit Profile</h3>
          <div><i class="fa-solid fa-xmark" onClick={()=>{setEditForm(false)}}></i></div>
        </div>
    <label htmlFor="name">Name</label><br />
    <input type="text" id="name" name="name" ref={name} /><br /><br />

    <label htmlFor="phone">Phone No</label><br />
    <input type="tel" id="phone" ref={phone}/><br /><br />

    <label htmlFor="address">Address</label><br />
    <textarea id="address"  ref={address}/><br /><br />

    <h6>College Information</h6>
    <label htmlFor="college_name">College Name</label><br />
    <input type="text" id="college_name" name="collegeName" ref={collgN} /><br /><br />

    <label htmlFor="college_address">College Address</label><br />
    <textarea id="college_address" name="collegeAddress" ref={collgA}/><br /><br />

    {/* <h2>Skills & Profiles</h2>
    <label htmlFor="skills">Skills:</label><br />
    <textarea id="skills" name="skills" value={formData.skills} onChange={handleChange} required /><br /><br /> */}

    <label htmlFor="github">GitHub Profile</label><br />
    <input type="url" id="github" name="github" ref={github}/><br /><br />

    <label htmlFor="linkedin">LinkedIn Profile</label><br />
    <input type="url" id="linkedin" name="linkedin" ref={linkedin} /><br /><br />

     <div className="btn-op">
        <button id="cancel" onClick={()=> setEditForm(false)}>cancel</button>
        <button id="save" type='button' onClick={handleSubmit}><i class="fa-solid fa-check"></i> save</button>
     </div>
</form>
</div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import getAccessToken from '../Utils/auth';
import { useDispatch, useSelector } from 'react-redux';
import '../Styles/Profile.css'
import github from '../Images/github.png';
import linkedin from '../Images/linkedin.png'
import email from '../Images/gmail.png';
import ProfileEditForm from './ProfileEditForm';
import { fetchUser } from '../Data_Store/Features/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const [Imgloading , setImgLoading] = useState(false);
  const [dataLoading,setDataLoading] = useState(false);
  const profileRef = useRef();
  const [editform, setEditForm] = useState(false);
  const { username } = useParams();

  const {data,isLoading} = useSelector((store)=> store.user);

  const [profile,setProfile] = useState({});  // state for storing fetched user's profile data

  const [profileImg,setProfileImg] = useState(null);

  const handleProfileChange = async () => {
    setImgLoading(true);
    const selectedFile = profileRef.current.files[0];

    if (!selectedFile) {
        console.error('No file selected');
        return;
    }

    const formData = new FormData();
    formData.append('profile', selectedFile);

    try {
        const response = await fetch( `${process.env.REACT_APP_API_BASE_URL}/users/profile-photo/${username}`, {
            method: 'POST',
            headers:{
              'Authorization': `Bearer ${getAccessToken()}`
            },
            body: formData,
        });

        if (response.ok) {
            console.log('File uploaded successfully');
            dispatch(fetchUser()).then(()=>{
              setImgLoading(false);

            })

            
        } else {
            console.error('File upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

  useEffect(() => {
     fetchProfileDetails();
  }, [])

  // fetching user's profile info
  const fetchProfileDetails = async()=>{
    setDataLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile/${username}`, {
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

      setProfileImg(res.githubData.avatar_url)

     // update the state with the fetched user detail
     setProfile(res);


     // stoping the loader
     setDataLoading(false);
      
    } catch (error) {
      return  error.message || "An error occurred while loading";
    }
  }
  return (

    (!dataLoading && !isLoading) ?
    <div className='frame'>
      {
        editform && <ProfileEditForm setEditForm={setEditForm} username={username} setUser={setProfile} />
      }
      <div className="left-frm">
        <div className="prf-img">
          <div id="bg">
          </div>
          <section className={profileImg? "img with-image" : "img without-image"}>
            {profileImg ? (
              !Imgloading ?<img src={profileImg} alt="" /> :<div class="spinner-border" id='img-load' role="status">
              <span class="sr-only">Loading...</span>
            </div>
            ) : (
              <div className="no-image-placeholder">No Image</div>
            )}
            {/* only that particular user can change his profile picture  */}
           {  username=== data.username&& 
            <p className='hoverProfile'><input type="file" name="profile" id='profile-upload' ref={profileRef} onChange={handleProfileChange}/>Upload photo</p>
           }
          </section>

          <section className='names'>
            <div>
              <h5>{profile?.fullname}</h5>
              <h6>@{profile?.username}</h6>
            </div>
            <div className="prf-ed">
              {/* only that user can edit his/her profile not any visitor  */}
              {  data.username=== username && 
              <i class="fa-regular fa-pen-to-square" onClick={() => setEditForm(true)}></i>
              }
            </div>
          </section>
        </div>

        <div className="coreDetail">
          <section>
            <ul id='c-info'>
              <li><p className='lt'>Phone</p> <p className='rt'>+91 {profile?.phone}</p></li>
              <li><p className='lt'>Address</p><p className='rt'>{profile?.address}</p></li>
            </ul>
            <div className="socials">
              <a target='_blank' href={profile?.githubProfile}><img src={github} alt="" /></a>
              <a target='_blank' href={profile?.linkedinProfile}><img src={linkedin} alt="" /></a>
              <a target='_blank' href={profile?.email}><img src={email} alt="" /></a>
            </div>
          </section>
        </div>

      </div>
         <div className="dv"></div>
      <div className="right-frm">
        <div className="detl">
          <section className="block">
            <p id='part'>Work</p>
            <h6>Google developer , SWE-III </h6>
             <p>12th Bellingham Street, California , USA</p>
            <p></p>
          </section>
          <section className="block">
            <p id='part'>College</p>
            <h6>{profile?.collegName}</h6>
            <p>{profile?.collegeAddress}</p>
          </section>
          <section className="block">
            <p id='part'>skills</p>
            <div >
              <h6>Web development</h6>
              <div className='web-skills'>
                <span>React</span>
                <span>CSS</span>
                <span>JS</span>
                <span>ReactJs</span>
                <span>ExpressJS</span>
                <span>MongoDB</span>
                <span>Mongoose</span>
                <span>HTML</span>
                <span>Kubernates</span>
                <span>Reed</span>
                <span>CI/CD pipeline</span>
                <span>C</span>
                <span>Java</span>
                <span>Bootstrap</span>
                <span>SQL</span>
                <span>Node Js</span>
              </div>
            </div>
          </section>
          <section className="block">
            <p id='part'>Teams</p>
            <ul className='teams'>
              <li>Dev Darsan</li>
              <li>Hello</li>
              <li>ML Hunters</li>
              <li>DevHarbour</li>
            </ul>
          </section>
        </div>

      </div>

    </div>
    :  <div className='profileLoad'><div class="spinner-border text-light" role="status">
    <span class="sr-only">Loading...</span>
  </div></div> 
  )
}

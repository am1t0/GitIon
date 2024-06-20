// import React, { useRef, useState } from 'react'
// import getAccessToken from '../../Utils/auth.js';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'
// import { addTeam } from '../../Data_Store/Features/projectsSlice.js';
// import { fetchTeam } from '../../Data_Store/Features/projectsSlice.js';
// import "../../Styles/CreateTeam.css"
// import team from '../../Images/teamCrt.png'
// import LoadingBar from 'react-top-loading-bar'

// export default function CreateTeam() {

//   const navigate = useNavigate();

//   const nameRef = useRef();
//   const descriptionRef = useRef();
//   const dispatch = useDispatch();

//   const [progress, setProgress] = useState(0)

//   const handleSubmit =async (event) => {
//     event.preventDefault();
    
//     setProgress(10);

//     const name = nameRef.current.value;
//     const description = descriptionRef.current.value;

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/create-team`, {
//          method:'POST',
//          headers: {
//             'Content-Type': 'application/json',
//             'Authorization':`Bearer ${getAccessToken()}`
//           },
//           body: JSON.stringify({
//             name,
//             description
//           }),
//       });
//       if (!response.ok) {
//         return Promise.reject(response.statusText);
//       }
//       setProgress(80)
//       let newTeam = await response.json();
//       newTeam = newTeam.data
//       console.log('newTeam created is : ',newTeam)
     
//       dispatch(fetchTeam()).then(()=>{
//         setProgress(100)
//         navigate(`/${newTeam._id}/${newTeam.name}`)
//       });
      
//     nameRef.current.value = '';
//     descriptionRef.current.value = '';
     
       
//     } catch (error) {
//       console.error('Error creating todo:', error.message);
      
//     }

//   };



//   return (
//     <div className='teamCreate'>
//       {/* <button>Back</button> */}
//       <LoadingBar
//         color='rgb(42, 42, 231)'
//         progress={progress}
//         onLoaderFinished={() => setProgress(0)}
//       />
//       <div className='teamInpBox'>
//           <h3>Create Team</h3>
//           <p>create team to work on your great projects with your colleagues and revolutionize the world!</p>
//         <form onSubmit={handleSubmit}>
//           <div className="teamInp">
//              <label>Name</label>
//              <input type="text" ref={nameRef} required placeholder='name' />
//           </div>
//           <div className="teamInp">
//              <label>Description</label>
//             <textarea ref={descriptionRef} required placeholder='description ' style={{ height: '80px' }} ></textarea>
//           </div>
//           <div>
//           <button
//               type="button"
//               className='cancelBtn genBtn'
//               onClick={()=> navigate('/')}
//             >Cancel</button>
//             <button
//               type="submit"
//               className='createBtn genBtn'
//             >Create</button>
//           </div>
//         </form>
//       </div>
//       <div className="info">
//         <div className="teamImg">
//           <img src={team} alt='teamImg' />
//         </div>
//         <h5>Teamwork</h5>
//         <div className="para">
//           <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis, est blanditiis. Voluptate ducimus impedit nisi non delectus ea, dolorum possimus quibusdam quae, consequatur, accusantium distinctio quas vero nobis fugit veniam ullam pariatur enim inventore quia molestias voluptatem! Doloribus cum libero error vitae facilis.</p>
//         </div>
//       </div>
//     </div>
//   )
// }

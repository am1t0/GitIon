import React from 'react'
import '../Styles/SearchedUsers.css'

export default function SearchedUsers({setSearchedUser,searchedUser,getUserColor,setAssignee,setInputValue}) {
    const nameLogo =(name)=>{
        return  name[0].toUpperCase();
    }
    const handleUserClick=(user)=>{
        setInputValue(user.fullname);
        setAssignee(user._id);
        setSearchedUser([]);
    }
  return (
    searchedUser.length!==0 && (
    <div id='searchList'>
            
                 {searchedUser.map((user)=>(
                      <div id='matchedMemb' onClick={()=>{handleUserClick(user)}}>
                        
                        <div className="circle" style={{background:getUserColor(user.username)}}>
                         {nameLogo(user.fullname)}
                        </div>
                       <li>{user.fullname}</li> 
                        
                       </div>
                 ))
                }
    </div>
    )
  )
}

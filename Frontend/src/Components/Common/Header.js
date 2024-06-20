import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "../../Styles/Header.css";
import logo from '../../Images/lg.png'

export default function Header() {

  const {data,isError,isLoggin} = useSelector((store)=> store.user);

  return (
    <header className="header">
         <div className="logo-hac">
            <div className="lg">
             <img src={logo} alt="" />
            </div>
            <div className="hac">
              <Link to='/'><p>Home</p></Link>
              <Link to='/'><p>About</p></Link>
              <Link to='/'><p>Contact</p></Link>
              <Link to='/'><p>Help</p></Link>
            </div>
         </div>

         <div className="search-btns">
           <div className="search">
           <i class="fa-solid fa-magnifying-glass" aria-hidden="true"  ></i>
             <input type="search" placeholder='Search'/>
           </div>
           <div className="btns">
             <span id='add'><i class="fa-solid fa-plus"></i></span>
             <div className="features">
             <Link to={`/profile/${data?.username}`}><span><i class="fa-solid fa-user"></i></span></Link>
             <span><i class="fa-solid fa-moon"></i></span>
             </div>
           </div>
         </div>
    </header>
  );
}


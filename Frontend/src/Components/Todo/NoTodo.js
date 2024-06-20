import React from 'react'
import "../../Styles/NoTodo.css"
import cactus from "../../Images/cactus.png";

export default function NoTodo() {
  return (
    <div className='notodo' >
        <img src="https://thumbs.dreamstime.com/b/desert-landscape-vector-illustration-hand-drawn-black-white-line-desert-saguaro-opuntia-blooming-cactus-desert-117562289.jpg" alt="" />
        <h1>You have no Todos!</h1>
        <p>Manage your time and acitivities with ease</p>
     </div>
  )
}

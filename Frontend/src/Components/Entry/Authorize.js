import React, { useState } from 'react'
import Login from '../Login'
import RegisterPage from '../Register'

export default function Authorize() {

    const [authForm, setAuthForm] = useState('login')

  return (
      <>
        {
            authForm === 'login' 

            ? <Login setForm={setAuthForm}/> 
           
            : <RegisterPage  setForm={setAuthForm}/>
        }
      </>
  )
}

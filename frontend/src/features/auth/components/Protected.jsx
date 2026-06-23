import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'



const Protected = ({children}) => {

  const {user,loading} = useSelector((state) => state.auth)

if(loading){
  return <div>Loading...</div>
}

if(!user){
  return <Navigate to="/login"/>

}

  return (
    children
  )
}

export default Protected
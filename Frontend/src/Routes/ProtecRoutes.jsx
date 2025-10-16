import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const ProtecRoutes = ({children}) => {
    const isAuthenticate = useSelector((state)=>state.userReducer.isAuthenticate)
    if(!isAuthenticate){
        return <Navigate to = '/login' replace/>
    }
  return children
}
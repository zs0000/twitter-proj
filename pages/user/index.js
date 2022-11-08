import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { UserContext } from '../../context/UserContext'

export default function index() {
    let router =useRouter()
    const{username, setUsername} = useContext(UserContext)
useEffect(()=>{
    router.push(`/user/${username}`)
},[])
   
  return (
    <Layout>
        loading...
    </Layout>
  )
}

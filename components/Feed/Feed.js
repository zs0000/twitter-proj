import s from "./Feed.module.css"
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../utils/supabaseClient'
import PostBox from "../PostBox/PostBox"

import PostCard from "../PostCard/PostCard"
import RetweetCard from "../RetweetCard/RetweetCard"
import { PostContext } from "../../context/PostContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import ReplyPostCard from "../ReplyPostCard/ReplyPostCard"

import Layout from "../Layout/Layout"
import Head from "next/head"
import { UserContext } from "../../context/UserContext"

export default function Feed({ session }){

  const queryClient = useQueryClient();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [retweets, setRetweets] = useState(null);
  const [retweeters, setRetweeters] = useState(null)
  const {username, setUsername} = useContext(UserContext)
  const {firstName , setFirstName} = useContext(UserContext)
  const {lastName , setLastName} = useContext(UserContext)
  const {userID, setUserID} = useContext(UserContext)
  const [testIndex, setTestIndex] = useState(0)
  const {isOpen, setIsOpen} = useContext(PostContext);
  const {replyPost, setReplyPost} = useContext(PostContext);
  const {avatar_url, setAvatarUrl} = useContext(UserContext)
  const [posted, setPosted] = useState(null);

  const incrementIndex = () => {
    setTestIndex(testIndex+1)
  }

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!session?.user) {
      throw new Error('User not logged in')
    }
    setUserID(session.user.id)
    return session.user
  }
  const getFeedContented = async () => {
    const { data, error } =  await supabase
    .from("posts")
    .select("*")
        setPosts(data)
    console.log(data)
    if(error) {
      console.error(error.message)
    }
  
    if(!data) {
      console.error("feed not found")
    }
 
  
    return data
  }

  async function getRetweets(){
    try {
      let {data, error} = await supabase
      .from("retweets")
      .select(`
      profiles(
        username, firstname, lastname
      ),
      posts(
        *
      )
      `)
      if(data){
        console.log(data)
        setRetweets(data)

      
      }
    } catch (err) {
      console.error(err.message)
    }  console.log(retweets)
  }

  //Feed content fetched here - will optimize this in future
  async function getProfile() {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      const FeedContent = await getFeedContented();
   

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, firstname, lastname, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
       
        setUsername(data.username)
        setFirstName(data.firstname)
        setLastName(data.lastname)
        setAvatarUrl(data.avatar_url)
        
       
      }
    } catch (error) {
      alert(error.message)
    } finally {
      
      setLoading(false)
    }
  }
  useEffect(() => {
    setTestIndex(0)
    getProfile()
    getRetweets()


  }, [session, posted])
 
    return(
        <Layout>
          <Head>
            <title>Twitterd</title>
          </Head>
          {isOpen ? 
          <ReplyPostCard replyPost={replyPost}  />

          :
          <></>
          }
          
          
           <div className={s.content}>

          {loading === false ? <PostBox 
          posted={posted}
          avaUrl={avatar_url}
          setPosted={setPosted}
         
           /> : ""}
          {loading === false ? posts.map((post)=>(
            <PostCard 
            key={post.post_id}
            post={post}
            userID={userID}  />
          )) : 
          <>
          Fetching Posts...
          </>}
          {loading === false ? retweets.map((item)=>(
             <RetweetCard 
             ret={item.profiles}
             key={item.posts.post_id + item.profiles.firstname}
             post={item.posts}
             userID={userID}  />
          )) : 
          <>
          Fetching Posts...
          </>}
           </div>
          
        </Layout>
    )
}
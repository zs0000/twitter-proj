import s from "./Feed.module.css"
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../utils/supabaseClient'
import PostBox from "../PostBox/PostBox"
import Sidebar from "../Sidebar/Sidebar"
import FeedContent from "../FeedContent/FeedContent"
import PostCard from "../PostCard/PostCard"
import { PostContext } from "../../context/PostContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import ReplyPostCard from "../ReplyPostCard/ReplyPostCard"
import useFeedContent from "../../hooks/useFeedContent"
import Layout from "../Layout/Layout"
import Head from "next/head"
import { UserContext } from "../../context/UserContext"

export default function Feed({ session }){

  const queryClient = useQueryClient();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)

  const {username, setUsername} = useContext(UserContext)
  const {firstName , setFirstName} = useContext(UserContext)
  const {lastName , setLastName} = useContext(UserContext)
  const {userID, setUserID} = useContext(UserContext)

  const {isOpen, setIsOpen} = useContext(PostContext);
  const {replyPost, setReplyPost} = useContext(PostContext);

  const [posted, setPosted] = useState(null);

  


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
    .select("author, author_handle, posted_at, post_text,id, post_id")
      
  
    if(error) {
      console.error(error.message)
    }
  
    if(!data) {
      console.error("feed not found")
    }
 
    setPosts(data)
    return data
  }
  const { isLoading, isError, data, error } = useQuery({ queryKey: ['feedContent'], queryFn: getFeedContented })


  //Feed content fetched here - will optimize this in future
  async function getProfile() {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      const FeedContent = await getFeedContented();
   

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, firstname, lastname`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        console.log(data)
        setUsername(data.username)
        setFirstName(data.firstname)
        setLastName(data.lastname)
        
       
      }
    } catch (error) {
      alert(error.message)
    } finally {
      
      setLoading(false)
    }
  }
  useEffect(() => {
    getProfile()

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
           </div>
           <div className={s.explorecontainer}>
          
           </div>
        </Layout>
    )
}
import s from "./Feed.module.css"
import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../utils/supabaseClient'
import PostBox from "../PostBox/PostBox"
import Sidebar from "../Sidebar/Sidebar"
import FeedContent from "../FeedContent/FeedContent"
import PostCard from "../PostCard/PostCard"
import { PostContext } from "../../context/PostContext"
import { useQueryClient } from "@tanstack/react-query"
import ReplyPostCard from "../ReplyPostCard/ReplyPostCard"

export default function Feed({ session }){

  const queryClient = useQueryClient();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const {isOpen, setIsOpen} = useContext(PostContext);
  const {replyPost, setReplyPost} = useContext(PostContext);
  
  useEffect(() => {
    getProfile()

  }, [session])
  

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
    console.log(session.user)
    return session.user
  }
  async function getFeedContent(){
    try {
        setLoading(true)
        let {  data, error, status } = await supabase
        .from("posts")
        .select("author, author_handle, posted_at, post_text,id")

        if (error && status !== 406){
            throw error
        }

        if(data){
            setPosts(data)
           
        }

    } catch (err) {
        console.error(err.message)
    } finally {
        setLoadingPosts(false)
       
    }
}

  async function getProfile() {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      const FeedContent = await getFeedContent();
      

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        
       
      }
    } catch (error) {
      alert(error.message)
    } finally {
      
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

    return(
        <div className={s.main}>
          {isOpen ? 
          <ReplyPostCard replyPost={replyPost}  />

          :
          <></>
          }
          
          <div className={s.sidebarcontainer}>
          <Sidebar/>
          </div>
           <div className={s.content}>

          <PostBox/>
          {posts.map((post)=>(
            <PostCard key={post.id} post={post}  />
          ))}
           </div>
           <div className={s.explorecontainer}>
          
           </div>
        </div>
    )
}
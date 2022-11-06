import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../../../context/PostContext";
import { useQuery } from "react-query";
import Router, { useRouter } from "next/router";
import { supabase } from "../../../../../utils/supabaseClient";
import StatusCard from "../../../../../components/StatusCard/StatusCard";
import Layout from "../../../../../components/Layout/Layout";
import Head from "next/head";
import s from "../../../../../styles/StatusPage.module.css"
import StatusReplyBox from "../../../../../components/StatusReplyBox/StatusReplyBox";
import { UserContext } from "../../../../../context/UserContext";
import ReplyCard from "../../../../../components/ReplyCard/ReplyCard";

//https://stackoverflow.com/questions/71360998/nextjs-router-query-not-giving-the-id-param
//allows for use of params in supabase query, making dynamic data fetching smoother
export async function getServerSideProps(context) {
    const { id } = context.query;
    const { status } = context.query;

    return { props: { id,status } };
  }

export default function StatusPage(props){
   
    const router = useRouter()
  
    const [replies, setReplies] = useState(null);
    const [loading, setLoading] = useState(true);
    const {recentPost, setRecentPost} = useContext(PostContext);
    const [received, setReceived] = useState(false);

    const {userID, setUserID} = useContext(UserContext)
    const {username, setUsername} = useContext(UserContext)
    const {firstName, setFirstName} = useContext(UserContext)
    const {lastName, setLastName}= useContext(UserContext)
    const {bio, setBio} = useContext(UserContext)
    const {joinDate, setJoinDate} = useContext(UserContext)
    const {location, setLocation} = useContext(UserContext)
    const {birthday, setBirthday} = useContext(UserContext)
    const {website, setWebsite} = useContext(UserContext)
    const {avatar_url, setAvatarUrl} = useContext(UserContext)
  


    const [postText, setPostText] = useState(null);

 

    async function getProfile() {
        try {
          setLoading(true)
          const user = await getCurrentUser()
    
          let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url, firstname, lastname, bio, join_date, living_in, birthday, completed_sign_up`)
            .eq('id', user.id)
            .single()
    
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
            setUserID(user.id)
            setUsername(data.username)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
            setFirstName(data.firstname)
            setLastName(data.lastname)
            setBio(data.bio)
            setJoinDate(data.join_date)
            setLocation(data.living_in)
            setBirthday(data.birthday)
        
        
            console.log(data)
           
          }
        } catch (error) {
          alert(error.message)
        } finally {
         
          setLoading(false)
        }
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
    
        return session.user
      }
    async function getPostData(){
        try {
          
            const status = router.query.status
            const {data, error} = await supabase
        .from("posts")
        .select("post_text, author, author_handle, post_id, posted_at, post_environment,post_image_url")
        .eq('post_id', status)
        .single() 

           
           if(data){
            setRecentPost(data)
           
           }

        } catch (err) {
            console.error(err.message)

        } finally{
           setLoading(false)
        }
    }
    async function getPostReplies(){
      try {
        
          const status = router.query.status
          const {data, error} = await supabase
      .from("replies")
      .select("reply_text, reply_author, reply_author_handle, reply_to_handle, reply_posted_at")
      .eq("reply_to_status",status)
      
    

         
          setReplies(data)
          console.log(replies)

      } catch (err) {
          console.error(err.message)

      } finally{
         setLoading(false)
      }
  }
    
  
   const handleNavigateHomeBarClick = () => {
   
    router.push(`/home`)
   
   }
   useEffect(()=>{
    getProfile()
    getPostData()
    getPostReplies()
    },[])
    return(
        <Layout>
            <Head>
                <title>{props.id}'s status page</title>
            </Head>
                <div className={s.content}>
                    <div className={s.homenavigatebar} onClick={()=>handleNavigateHomeBarClick()}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.navsvg}><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
                        <span className={s.navtext}>
                            Tweet
                        </span>
                    </div> 
                    {loading === false ?
                    <>
                    <StatusCard post={recentPost}/> 
                    <StatusReplyBox post={recentPost} />
                    <div className={s.replies}>
                      {replies ? replies.map((reply)=>(
                        <ReplyCard reply={reply}/>
                      )) : <>no replies</>}
                    </div>
                    </>
                    
                    : 
                    <>fetching post..</>}
                </div>
            <div className={s.explorecontainer}>

            </div>
        </Layout>
    )
}
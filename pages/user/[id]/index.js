import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import Layout from "../../../components/Layout/Layout";
import s from "../../../styles/ProfilePage.module.css"
import { supabase } from "../../../utils/supabaseClient";
import Head from "next/head";
import Image from "next/image";
import * as pic from "../../../public/1500x500.jpg"
import * as user from "../../../public/anonyuser.jpg"
import PostCard from "../../../components/PostCard/PostCard";
import { UserContext } from "../../../context/UserContext";

//
export async function getServerSideProps(context) {
    const { id } = context.query;
    

    return { props: { id } };
  }

export default function ProfilePage(props){
    const router = useRouter();
    let { id } = router.query
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [profileID, setProfileID] = useState(null);
    const [posts, setPosts] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false);
 
    const [followers, setFollowers] = useState(null)
    const [following, setFollowing] = useState(null)
    
    const {username, setUsername} = useContext(UserContext)
    const {firstName , setFirstName} = useContext(UserContext)
    const {lastName , setLastName} = useContext(UserContext)
    const {userID, setUserID} = useContext(UserContext)

    let x = [];
 

    
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

      async function getProfile() {
        try {
          setLoading(true)
          const user = await getCurrentUser()
        
          let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, firstname, lastname`)
            .eq('id', user.id)
            .single()
    
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
           
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

    async function getFollowers(tested){
        try {
            let {data, error} = await supabase
            .from("relationships")
            .select("*")
            .eq("followed_id", tested)

            if(data){
                console.log(data)
                let j = data.length
                setFollowers(j)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    async function getFollowing(tested){
        try {
            let {data, error} = await supabase
            .from("relationships")
            .select("*")
            .eq("follower_id", tested)

            if(data){
                console.log(data)
                let j = data.length
                setFollowing(j)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    async function getTweets(){
        try {
            let {data, error} = await supabase
            .from("posts")
            .select("post_text, author, author_handle, posted_at, post_id, post_image_url")
            .eq("author_handle", id)
            if(data){
                setPosts(data)
            }
        } catch (err) {
            console.error(err.message)
        } finally{
          
           
        }
    }

    async function getPublicProfileData(){
        try {
            
            let { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("username", id)

           
            if(data){
                setProfileData(data[0])
                const tested = data[0].id
                getFollowers(tested)
                getFollowing(tested)
                
            }

        } catch (err) {
           console.error(err.message) 
        } finally{
           
          
        }
    }
    
    async function getRelationshipData(){
        try {
          
            let {data, error} = await supabase
            .from('relationships')
            .select("id")
            .eq("follower_id", id)
            .eq("followed_id", profileData.id)
            .single()
            

            if(data){
                console.log(data)
                    
                        if(data.follower_id == userID){
                            setIsFollowing(true)
                            console.log("trueeeee")
                        } else {
                            setIsFollowing(false)
                            console.log("fallseess")
                        }
                    
                    
               

                
            }
        } catch (err) {
            console.error(err.mesage)
        } finally {
            
        }
    }

    async function handleClickFollow() {
        try {
          let updates = {
            follower_id: userID,
            followed_id: profileData.id,
          }

          

          let { error } = await supabase.from('relationships').upsert(updates)
    
          if (error) {
            console.log(error)
            throw error
          }
        } catch (error) {
          alert(error.message)
        } finally {
       
        }
      }

      
    useEffect(()=>{
        getProfile()
        getPublicProfileData()
   
       
        getTweets()
        setLoading(false)
    },[])

    return(<Layout>
        <Head>
            <title>
                {id}'s profile 
                
            </title>
        </Head>
        {loading == false  ?
        <>
        <div className={s.content}>
            <div className={s.homenavbar}>
                <span>back</span>
            </div>
            <div className={s.topcontainer}>
            <div className={s.profilepicturecontainer}>
                <div className={s.picborder}>
                <Image className={s.pic} src={user} height={130} width={130}/>
                </div>
               
            </div>
            <div className={s.bannerimagecontainer}>
                <Image  src={pic} height={500} width={1500} />
            </div>
        
            <div className={s.profileinteractbar}>
                <div className={s.svgcontainer}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                </div>
                <div className={s.svgcontainer}><svg viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path></g></svg>
                </div>
                <div className={s.svgcontainer}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-.86 13h-4.241c-.464 2.281-2.482 4-4.899 4s-4.435-1.719-4.899-4H2.87L4 9.05C4.51 5.02 7.93 2 12 2v2C8.94 4 6.36 6.27 5.98 9.3L5.13 16h13.73l-.38-3h2.02l.64 5zm-6.323 0H9.183c.412 1.164 1.51 2 2.817 2s2.405-.836 2.817-2z"></path></g></svg>
                </div>
                <div className={s.followbuttoncontainer}>
                    {isFollowing ?
                    <span onClick={() => handleClickFollow(profileData)} className={s.followbutton}>Following</span>
                    
                    :
                    <span onClick={() => handleClickFollow(profileData)} className={s.followbutton}>Follow</span>

                    }
                </div>
            </div>
            </div>
            <div className={s.whoiscontainer}>
                <div className={s.namescontainer}>
                    <span className={s.name}>
                    {profileData ? profileData.firstname + " " + profileData.lastname : ""}
                    </span>
                    <span className={s.handle}>
                    {profileData ? "@"+profileData.username : ""}
                    </span>
                
                
                </div>
                <div className={s.biocontainer}>
                    <span className={s.bio}>
                    {profileData ? profileData.bio : ""}
                    </span>
                </div>
                <div className={s.extrainfocontainer}>
                <span className={s.extrainfo}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.extrasvg}><g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></g></svg>
                {profileData ? profileData.living_in : ""}
                </span>
                <span className={s.extrainfo}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.extrasvg}><g><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></g></svg>
                {profileData ? profileData.website : ""}
                </span>
                <span className={s.extrainfo}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={s.extrasvg}><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>
                    Joined October 2022
                </span>
                </div>
                <div className={s.followcontainer}>
                <span className={s.following}>
                {following ? following : 0} Following
                </span>
                <span className={s.followers}>
                {followers ? followers : 0} Followers
                </span>
                </div>
            </div>
            <div className={s.filternavigationbar}>
                <span className={s.filternavitem}>
                    Tweets
                </span>
                <span className={s.filternavitemlarge}>
                    Tweets & replies
                </span>
                <span className={s.filternavitem}>
                    Media
                </span>
                <span className={s.filternavitem}>
                    Likes
                </span>
            </div>
            <div className={s.posts}>
                {posts ? posts.map((post)=>(
                    <PostCard key={post ? post.post_id : ""} userID={userID} post={post}/>
                )) : <div>
                        It seem's you haven't made a post yet!
                    </div>}
            </div>
        </div>
        <div className={s.explorecontainer}>

            </div>
        </>
             :
             <>Loading</>
             }
        
    </Layout>)
}
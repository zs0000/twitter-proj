import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react"
import Layout from "../../../components/Layout/Layout";
import s from "../../../styles/ProfilePage.module.css"
import { supabase } from "../../../utils/supabaseClient";
import Head from "next/head";
import Image from "next/image";

import PostCard from "../../../components/PostCard/PostCard";
import { UserContext } from "../../../context/UserContext";
import ProfileInteractionsBar from "../../../components/ProfileInteractionsBar/ProfileInteractionsBar";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import ProfileEditModal from "../../../components/ProfileEditModal/ProfileEditModal";

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
    const [isOwner, setIsOwner] =  useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const {username, setUsername} = useContext(UserContext)
    const {firstName , setFirstName} = useContext(UserContext)
    const {lastName , setLastName} = useContext(UserContext)
    const {userID, setUserID} = useContext(UserContext)
    const {bio, setBio} = useContext(UserContext)
    const {living_in, setLivingIn} = useContext(UserContext)
    const {website, setWebsite} = useContext(UserContext)
    const {avatar_url, setAvatarUrl} = useContext(UserContext)
    const {header_url, setHeaderUrl} = useContext(UserContext)
    const [testing, setTesting] =useState(null)
    let x = [];
 

    
    async function getCurrentUser() {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        setTesting(session.user.id)
        if (error) {
          throw error
        }
    
        if (!session?.user) {
          throw new Error('User not logged in')
        }
      
        return session.user
      }

      async function getProfile() {
        try {
          setLoading(true)
          const user = await getCurrentUser()
         
          let { data, error, status } = await supabase
            .from('profiles')
            .select(`*`)
            .eq('id', user.id)
            .single()
    
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
            setUserID(data.id)
            setUsername(data.username)
            setFirstName(data.firstname)
            setLastName(data.lastname)
            setBio(data.bio)
            setLivingIn(data.living_in)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
            setHeaderUrl(data.header_url)
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
            .select("post_text, author, author_handle, posted_at, post_id, profile_picture , post_image_url")
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
   
    
      
    useEffect(()=>{
       
      getProfile()
      getPublicProfileData()
    
       
      getTweets()
        
    },[router.query.slug])

    return(<Layout>
        <Head>
            <title>
                {id}s profile 
                
            </title>
        </Head>  
        {isOwner && editOpen ? 
        <ProfileEditModal
        setEditOpen={setEditOpen}
        editOpen={editOpen}
        userID={userID}
        setUsername={setUsername}
        username={username}
        setFirstName={setFirstName}
        firstName={firstName}
        setLastName={setLastName}
        lastName={lastName}
        setBio={setBio}
        bio={bio}
        setLivingIn={setLivingIn}
        living_in={living_in}
        setWebsite={setWebsite}
        website={website}
        setAvatarUrl={setAvatarUrl}
        avatar_url={avatar_url}
        setHeaderUrl={setHeaderUrl}
        header_url={header_url}

        />
        :
        <></>
        
        }
        
        {loading == false  ?
        
        <ProfileCard
        id={id}
        profileData={profileData}
        user={userID}
        posts={posts}
        following={following}
        followers={followers}
        isOwner={isOwner}
        setIsOwner={setIsOwner}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        />
        

             :
             <>Loading</>
             }
        
    </Layout>)
}
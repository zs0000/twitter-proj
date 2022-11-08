import React, { useEffect, useState } from 'react'
import s from './ProfileCard.module.css'
import Image from 'next/image'
import * as pic from "../../public/1500x500.jpg"
import * as anonyuser from "../../public/anonyuser.jpg"
import ProfileInteractionsBar from '../ProfileInteractionsBar/ProfileInteractionsBar'
import { supabase } from '../../utils/supabaseClient'
import PostCard from '../PostCard/PostCard'
import ProfileNavbar from '../ProfileNavbar/ProfileNavbar'

export default function ProfileCard({profileData,user, following, followers,posts}) {
       
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false)

    async function getRelationshipData (){
        let {data, error} = await supabase
        .from('relationships')
        .select('*')
        .eq('followed_id', profileData.id)
        .eq("follower_id", user)
        .single();
        if(profileData.id == user){
            console.log("This is owner")
        }
        if(data){
            console.log(data)
            setIsFollowing(true)
            setLoading(false)
        return true;
        }
        else{
            setIsFollowing(false)
            setLoading(false)
            return false;
        }
    }

    async function testFunction(){
        try {
            let x = await getRelationshipData()
            console.log(x)
        } catch (err) {
            console.error(err.message)
        }
    }
    async function handleClickFollow() {
        try {
          let updates = {
            follower_id: user,
            followed_id: profileData.id,
          }

          

          let { error } = await supabase.from('relationships').upsert(updates)
          setIsFollowing(true)
          if (error) {
            console.log(error)
            throw error
          }
        } catch (error) {
          alert(error.message)
        } finally {
       
        }
      }
      async function handleClickUnfollow() {
        try {
    
          let {error} = await supabase
          .from("relationships")
          .delete("*")
          .eq("followed_id", profileData.id)
          .eq("follower_id", user)
          setIsFollowing(false)
          

        
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
        testFunction()
    },[profileData])

  
  return (
    <div className={s.content}>
           {loading == false ?
           <ProfileNavbar
           tweets={posts.length}
           fullname={profileData.firstname + " " + profileData.lastname}
           /> :
           <></>}
            <div className={s.topcontainer}>
            
            <div className={s.bannerimagecontainer}>
                {loading== false ? 
                <Image  src={profileData.header_url} height={500} width={1500} />
                :
                <></>}
                
                <div className={s.profilepicturecontainer}>
                    <div className={s.piccontained}>
                <div className={s.picborder}>
                    {loading == false ? 
                    <Image className={s.pic} src={profileData.avatar_url} layout="fill"/>
                    :
                    <></>}
                
                </div>
                </div>
               
            </div>
            </div>
            {loading == false ? <ProfileInteractionsBar
            handleClickFollow={handleClickFollow}
            handleClickUnfollow={handleClickUnfollow}
            isFollowing={isFollowing}
            setIsFollowing={setIsFollowing}
            />: <></>}
            
           
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
                <span className={s.linkinfo}>
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
                {following ? following : 0}
                </span>
                <span className={s.followtext}>Following</span>
                <span className={s.followers}>
                {followers ? followers : 0} 
                </span>
                <span className={s.followtext}>Following</span>
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
            {posts ? posts.map((post)=>(
                <PostCard post={post} key={post.post_id} />
            )) 
        :
        <></>}
        </div>
  )
}

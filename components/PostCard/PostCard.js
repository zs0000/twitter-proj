import s from "./PostCard.module.css"
import Image from "next/image"
import anonyuser from "../../public/anonyuser.jpg"

import {useContext, useEffect, useState} from "react"
import { useRouter } from "next/router"
import { PostContext } from "../../context/PostContext"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { supabase } from "../../utils/supabaseClient"
import { UserContext } from "../../context/UserContext"

export default function PostCard({post}){

    
    const router = useRouter();
    const queryClient = useQueryClient();
    const tempPostStorage = {};
    const [loading, setLoading] = useState(true);
    const {replyPost, setReplyPost} = useContext(PostContext);
    const {isOpen, setIsOpen} = useContext(PostContext);
    const {userID, setUserID} = useContext(UserContext)
    const [recentPost, setRecentPost] = useState(null)
    const [replyCount, setReplyCount] = useState(null);
    const [retweetCount, setRetweetCount] = useState(null)
    const [likeCount, setLikeCount] = useState(null)
    const [testPost, setTestPost] = useState(null)
    const [isAuthor, setIsAuthor] = useState(false);
    const [extraModalOpen, setExtraModalOpen] = useState(false)
    const [likedTweet, setLikedTweet] = useState(false);
    const [retweetModalIsOpen, setRetweetModalIsOpen] = useState(false)
    const [retweetText, setRetweetText] = useState(null)
    const [isQuoteTweet, setIsQuoteTweet] = useState(false)
    const [hasImg, setHasImg] = useState(false);
    const [imgURL, setImgURL] = useState(null)
   

    async function checkIfAuthor () {
        try {
            if(post.id === userID){
                setIsAuthor(true)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    async function checkIfLikedTweet (){
        try {
            let {data, error} = await supabase
            .from("likes")
            .select("id")
            .eq('status_id', post.post_id)
            .eq('liked_by', userID)
            .single()

            if(data){
                
                setLikedTweet(true)
            }

        } catch (err) {
           
        }
    }
    async function checkIfImageTweet (){
        try {
           if(post.post_image_url == null) {
          
           } else{
            setHasImg(true)
           }

        } catch (err) {
            throw error
        }
    }


    async function getPostReplyCount(){
        try {
            
            let {data, error} = await supabase
            .from("replies")
            .select("reply_to_status")
            .eq('reply_to_status', post.post_id)

            if(data){
                setReplyCount(data.length)
             
            }

        } catch (err) {
            console.error(err.message)
        } finally{
          setLoading(false)  
        } 
    }
    async function getRetweetCount(){
        try {
            let{data, error} = await supabase
            .from("retweets")
            .select("id")
            .eq("status_id", post.post_id)

            if(data){
                setRetweetCount(data.length)
            }

        } catch (err) {
            console.error(err.message)
        }
    }

    async function getPostLikeCount(){
        try {
            let{data, error} = await supabase
            .from("likes")
            .select("id")
            .eq("status_id", post.post_id)

            if(data){
                setLikeCount(data.length)
            

            }
            
        } catch (err) {
            console.error(err.message)
        }finally{
            setLoading(false) 
        }
    }

    //https://stackoverflow.com/questions/66306667/prevent-event-from-propagating-to-children 

    //changed method to onClickCapture - need to "intercept the events in the capturing phase"
    // then stop propagation
    const handleReplyModal = async({post},e) => {
        e.stopPropagation();
       console.log(post)
        setReplyPost(post)
       if(post !== null){
        setLoading(false)
        setIsOpen(true)
       }

       
        
    
    }

    //can likely optimize in the future to bundle functions (ex; function(state, value))
    const handleRetweetModalOpen = (e) => {
        e.stopPropagation()
        setRetweetModalIsOpen(!retweetModalIsOpen)
    }
    const handleExtraModalOpen = (e) => {
        e.stopPropagation()
        setExtraModalOpen(!extraModalOpen)
    }

    const handleNavigateToAuthorsPage = (author_handle, e) => {
        
        router.push(`/user/${author_handle}`)
        e.stopPropagation();
    }

    const handleNavigateToStatusPage = async({post}) => {
        try {
           
        setRecentPost(post.post_id)
        router.push(`/user/${post.author_handle}/status/${post.post_id}`)
        } catch (err) {
            console.error(err.message)
        }
    }

    const handleRemoveTweet = async(e) => {
        e.stopPropagation()
        try {
            let {error} = await supabase
            .from("posts")
            .delete("*")
            .eq("post_id", post.post_id)


        } catch (err) {
            console.error(err.message)
            throw error
        } finally {
            router.reload()
        }
    }

    const handleRetweet = async(e) => {
        e.stopPropagation()
        try {
            
            let inputs = {
                status_id: post.post_id,
                retweeted_by: userID,
                retweet_text: retweetText,
                is_quote_tweet: isQuoteTweet
            }

            let {error} = await supabase
            .from("retweets")
            .insert(inputs)
            console.log("Retweetedd")            
        } catch (err) {
            console.error(err.message)
        }
    } 

    const handleLikeTweet = async(e) => {
        e.stopPropagation()
        try {
            
            let inputs = {
                status_id: post.post_id,
                liked_by: userID,
            }
           if(likedTweet == true) {
            let {error} = await supabase
            .from("likes")
            .delete("*")
            .eq("status_id", post.post_id)
            .eq("liked_by", userID)
            setLikeCount(likeCount-1)
            setLikedTweet(false)
           } else {
            setLikeCount(likeCount+1)
            let { error} = await supabase
            .from("likes")
            .upsert(inputs)
            setLikedTweet(true)
           }
            

        } catch (err) {
            throw error
        }
    }
    useEffect(()=>{
     
        checkIfAuthor()
        checkIfLikedTweet()
        checkIfImageTweet()
        getPostReplyCount()
        getPostLikeCount()
        getRetweetCount()
    },[])
  
    return(
    <div className={s.postcontainer} onClick={() => handleNavigateToStatusPage({post})}>
        <div className={s.sidecontainer}>
            <div className={s.picturecontainer}>
            {loading == false ? 
            <Image src={post.profile_picture} className={s.profilepicture} width={50} height={50} />
                :
                <></>
        }
            </div>
        </div>
        <div className={s.primarycontainer}>
            <div className={s.authorcontainer}>
                <button  onClickCapture={(e) => handleNavigateToAuthorsPage(post.author_handle,e)}  className={s.author} >
                    {post ? post.author : ""} 
                </button>
                <button onClickCapture={(e) => handleNavigateToAuthorsPage(post.author_handle,e)}  className={s.authorhandle}>
                    @{post ? post.author_handle : ""}
                </button>
            </div>
            <div className={s.posttextcontainer}>
                {post ? post.post_text : ""}
            </div>
            {hasImg  ? 
            <div className={s.imagecontainer}>
                <Image className={s.image} src={post.post_image_url} height={1000} width={1000} layout="intrinsic"/>
            </div>
            : ""

            }

            <div className={s.interactionsbar}>
              
             
                <div onClickCapture={(e) => handleReplyModal({post},e)} className={s.svgcontainer}>
                <svg fill="#536471" viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                <span className={s.replycount}>
                    {loading ? ".." : replyCount}
                </span>
                </div>
                <div   className={s.svgcontainer}>
                   {retweetModalIsOpen 
                   ?
                    <div className={s.retweetoptionsmodal}>
                        <span className={s.modaloption}>
                        Quote Retweet
                        </span>
                        <span className={s.modaloption} onClickCapture={(e) => handleRetweet(e)}>
                        Retweet
                        </span>
                    </div>
                     :
                      <></>} 
                    <svg onClickCapture={(e) => handleRetweetModalOpen(e)} fill="#536471" viewBox="0 0 24 24" aria-hidden="true" color={likedTweet ? "color: rgb(249, 24, 128)" : ""} className={s.svg}><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                    <span className={s.replycount}>
                    {loading ? ".." : retweetCount}
                </span></div>
                <div onClickCapture={(e) => handleLikeTweet(e)} className={s.svgcontainer}>
                    <svg fill={likedTweet ? "rgb(249, 24, 128)" :"#536471"} viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                    <span className={s.replycount}>
                    {loading ? ".." : likeCount}
                </span>
                    </div>
                <div  className={s.svgcontainer}><svg fill="#536471" viewBox="0 0 24 24" aria-hidden="true" className={s.svg}><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg></div>
            </div>
        </div>
        {isAuthor == true ?
        <div className={s.optionscontainer}>
            <span onClickCapture={(e) => handleExtraModalOpen(e)}>
                .
            </span>
            <div className={extraModalOpen ? s.optionsmodal : s.hide}>
            <span onClick={(e) => handleRemoveTweet(e)} className={s.modaloption}>
                delete
            </span>
            <span className={s.modaloption}>
                Blah
            </span>
            </div>
        </div>
        :
        <></>}
    </div>
    )
}
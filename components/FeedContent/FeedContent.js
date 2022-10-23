import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import s from "./FeedContent.module.css"
import { useRouter } from 'next/router'
import PostCard from '../PostCard/PostCard'

export default function FeedContent(){

    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        getFeedContent();
    },[])



    async function getFeedContent(){
        try {
            setLoading(true)
            let {  data, error, status } = await supabase
            .from("posts")
            .select("author, author_handle, posted_at, post_text")

            if (error && status !== 406){
                throw error
            }

            if(data){
                setPosts(data)
                console.log(data)
            }

        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }


    return(
        <>{posts.map((post)=>(
            <PostCard post={post}/>
        ))}</>
    )
}
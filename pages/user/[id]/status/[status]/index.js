import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../../../context/PostContext";
import { useQuery } from "react-query";
import Router, { useRouter } from "next/router";
import { supabase } from "../../../../../utils/supabaseClient";
import StatusCard from "../../../../../components/StatusCard/StatusCard";
import Layout from "../../../../../components/Layout/Layout";
import Head from "next/head";
import s from "../../../../../styles/StatusPage.module.css"

//https://stackoverflow.com/questions/71360998/nextjs-router-query-not-giving-the-id-param
//allows for use of params in supabase query, making dynamic data fetching smoother
export async function getServerSideProps(context) {
    const { id } = context.query;
    const { status } = context.query;

    return { props: { id,status } };
  }

export default function StatusPage(props){
   
    const router = useRouter()
  
  
    const [loading, setLoading] = useState(true);
    const {recentPost, setRecentPost} = useContext(PostContext);
    const [received, setReceived] = useState(false);


    useEffect(()=>{
    getPostData()
    },[])



    async function getPostData(){
        try {
          
            const status = router.query.status
            const {data, error} = await supabase
        .from("posts")
        .select("post_text, author, author_handle, post_id")
        .eq('post_id', status)
        .single() 

           
            setRecentPost(data)
        

        } catch (err) {
            console.error(err.message)

        } finally{
           setLoading(false)
        }
    }

   const handleNavigateHomeBarClick = () => {
   
    router.push(`/home`)
   
   }
    
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
                    {loading === false ?<StatusCard post={recentPost}/> 
                    : 
                    <>fetching post..</>}
                </div>
            <div className={s.explorecontainer}>

            </div>
        </Layout>
    )
}
import { useContext, useState } from "react"
import s from "./StatusReplyBox.module.css"
import anonyuser from "../../public/anonyuser.jpg"
import Image from "next/image"
import { UserContext } from "../../context/UserContext"
import { supabase } from "../../utils/supabaseClient";

export default function StatusReplyBox({post}){

    const [replyText, setReplyText] = useState(null)
    const [loading, setLoading] = useState(false)
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
    async function replyTweet(){
        try {
          setLoading(true)
         
          const inputs = {
            id: post.id,
            replier_id: userID,
            reply_text:replyText,
            reply_author: firstName + " " + lastName,
            reply_author_handle:username,
            reply_environment:"Twitter for Desktop",
            reply_type: "text",
            reply_to_handle: post.author_handle,
            reply_to_status:post.post_id
          }

          let { data, error } = await supabase.from('replies').insert(inputs);
         
          if(error){
            console.log("Its an error /:")
            throw error
          }
          
        } catch (err) {
          console.error(err.message)
        }finally{
         console.log("I made a reply!")
          setReplyText(null)
          setLoading(false)
        }
      }

    return(
        <div className={s.container}>
            <div className={s.leftsidecontainer}>
            <div className={s.picturecontainer}>
                <Image src={anonyuser} className={s.profilepic} width={50} height={50} />
            </div>
            </div>
            <div className={s.textareacontainer}>
            <textarea className={s.textbox} value={replyText|| ''} onChange={(e) => setReplyText(e.target.value)}  name="replyText" placeholder="Tweet your reply" />
            </div>
            <div className={s.buttoncontainer}>
            <button onClick={()=> replyTweet()} className={s.button}>
                Reply
            </button>
            </div>
        </div>
    )
}
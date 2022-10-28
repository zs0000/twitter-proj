import s from "./ReplyPostCard.module.css"
import anonyuser from "../../public/anonyuser.jpg"
import { useContext, useState } from "react";
import Image from "next/image"
import { PostContext } from "../../context/PostContext";

export default function ReplyPostCard({replyPost, user}){

  const [replyText,setReplyText] = useState(null);
  const [loading, setLoading] = useState(true);
  const {isOpen, setIsOpen} = useContext(PostContext)
  
  async function postReply(){
    try {
      setLoading(true);
      const inputs = {
        replyText
      }
      
    } catch (err) {
      console.error(err.message)
    }finally{
      setLoading(false);
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }

return(
  <div className={s.replymodal}>
  <div className={s.backgroundcontainer}>
  <div className={s.modalcontainer}>
     <div className={s.exitbuttoncontainer}>
      <button onClick={()=> handleCloseModal()} className={s.exitbutton}>X</button>
     </div>
     <div className={s.postcontainer}>
        <div className={s.sidecontainer}>
            <div className={s.picturecontainer}>
            <Image src={anonyuser} className={s.profilepicture} width={50} height={50} />
            </div>
        </div>
        <div className={s.primarycontainer}>
            <div className={s.authorcontainer}>
                <span className={s.author}>
                    {replyPost ? replyPost.author : ""}
                </span>
                <span className={s.authorhandle}>
                    @{replyPost ? replyPost.author_handle : ""}
                </span>
            </div>
            <div className={s.posttextcontainer}>
                {replyPost ? replyPost.post_text : ""}
            </div>
           
        </div>
       
    </div>
    <div className={s.secondarypostcontainer}>
    
    </div>
 
     <div className={s.replycontainer}>
      <textarea value={replyText || ''} onChange={(e) => setReplyText(e.target.value)} name="replyText" className={s.replytextarea} />
     </div>
  </div>
  </div>
  
</div>
)
}
import s from "./FollowItem.module.css"
import Image from "next/image"
export default function FollowItem({image, fullname, username}){
    return(
        <div className={s.container}>
            <div className={s.imagecontainer}>
                {image ? 
                <Image className={s.image} src={image} width={48} height={48} layout="intrinsic"/>    
                :
                "no picture /:"
            }
            </div>
            <div className={s.usercontainer}>
                <span className={s.fullname}>
                {fullname}
                </span>
                <span className={s.username}>
                @{username}
                </span>
            </div>
            <div className={s.buttoncontainer}>
                <button className={s.button}>
                    Follow
                </button>
            </div>
        </div>
    )
}
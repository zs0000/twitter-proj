import { useEffect, useState } from "react";
import s from "./ProfileInteractionsBar.module.css"

export default function ProfileInteractionsBar({isFollowing, setIsFollowing, handleClickFollow, handleClickUnfollow} ){

    return(
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
                    
                   {isFollowing == true ?
                    <span onClick={()=>handleClickUnfollow()} className={s.followbutton}>Following</span> :
                    <span onClick={()=>handleClickFollow()} className={s.followbutton}>Follow</span>}
                </div>
            </div>
    )
}
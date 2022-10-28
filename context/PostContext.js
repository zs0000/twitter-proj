import { useState, useContext, createContext } from "react";
import { ReactDOM } from "react";
 
export const PostContext = createContext();

export const PostContextProvider = props => {
    const [replyPost, setReplyPost] = useState(null);
    const [userReplying, setUserReplying] = useState(null);
    const [isOpen, setIsOpen] = useState(false);


return(
    <PostContext.Provider value={{ userReplying, setUserReplying,replyPost, setReplyPost,isOpen, setIsOpen}}>
        {props.children}
    </PostContext.Provider>);
    
}
import { useState, useContext, createContext } from "react";

 
export const UserContext = createContext();

export const UserContextProvider = props => {

    const [userID, setUserID] = useState(null)
    const [username, setUsername] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [bio, setBio] = useState(null)
    const [joinDate, setJoinDate] = useState(null)
    const [living_in, setLivingIn] = useState(null)
    const [birthday, setBirthday] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [header_url, setHeaderUrl] = useState(null)
  
    const [signedUp, setSignedUp] = useState(null)

return(
    <UserContext.Provider value={{ username, setUsername,firstName, setFirstName,
        lastName, setLastName,
        bio, setBio,
        joinDate, setJoinDate,
        living_in, setLivingIn,
        birthday, setBirthday,
        website, setWebsite,
        avatar_url, setAvatarUrl,
        header_url, setHeaderUrl,
        signedUp, setSignedUp,
        userID, setUserID}}>
        {props.children}
    </UserContext.Provider>);
    
}
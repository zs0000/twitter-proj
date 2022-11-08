import { useState } from "react"
import { supabase } from "../../utils/supabaseClient"
import s from "./ProfileEditModal.module.css"
import Axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
export default function ProfileEditModal({editOpen, setEditOpen,userID, setUsername, username, setFirstName, firstName, setLastName, lastName, setBio, bio, setWebsite, website,setAvatarUrl, avatar_url, setHeaderUrl, header_url, living_in, setLivingIn }) {
    const [loading, setLoading] =useState(false)
    const [imageSelected, setImageSelected] = useState("")
    const [status, setStatus] = useState("current")
    
    const handleImageUpload = async() =>{
   
        try {
          const formData = new FormData()
        formData.append("file", imageSelected)
        formData.append("upload_preset", "jrkwcuxy")
        
       Axios.post("https://api.cloudinary.com/v1_1/repdb/image/upload",
        formData).then((response)=>{
         console.log(response)
         setAvatarUrl(response.data.url)
         setStatus("uploaded")
        })
      
        
        } catch (error) {
          
        }
     
    
       
      } 

    async function updateProfile({ username, website, firstname, lastname, bio,  living_in }) {
        try {
          setLoading(true)
         
     
    
          const updates = {
   
            username,
            website,
            firstname: firstName,
            lastname: lastName,
            bio,
            living_in: living_in,
            avatar_url,
            updated_at: new Date(),
          }
    
          let { error } = await supabase.from('profiles').update(updates).eq("id", userID)
    
          if (error) {
            throw error
          }
        } catch (error) {
          alert(error.message)
        } finally {
            setEditOpen(false)
            toast('You may need to refresh for changes to take effect.')
          setLoading(false)
        }
      }
  return (
    <div className={s.container}>
        <div className={s.background}>
        <div className={s.form}>
            <span onClick={()=>setEditOpen(!editOpen)}>
                x
            </span>
           <div className={s.topinputcontainer}>
        <label className={s.label} htmlFor="username">Profile Picture</label>
        
        <input
        
          id="upload_file"
          type="file"
          
        
          onChange={(e) => {
            setImageSelected(e.target.files[0])
            setStatus("uploading")
          }}
          
        />
<span className={status == "current" ? s.gray : status == "uploaded" ? s.green : s.yellow}></span>
        <button onClick={()=>handleImageUpload()} className={s.uploadbutton}>
            Upload
        </button>
        <input
        className={s.linkinput}
          
          type="text"
           
            value={"Current: " + avatar_url ||""}
           disabled
     
        />
      </div>
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="username">Username</label>
        <input
        className={s.input}
          id="username"
          type="text"
          placeholder='Username'
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="firstname">First Name</label>
        <input
        className={s.input}
          id="firstname"
          type="text"
          placeholder='First name'
          value={firstName || ''}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="lastname">Last Name</label>
        <input
        className={s.input}
          id="lastname"
          placeholder='Last name'
          type="text"
          value={lastName || ''}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="bio">bio</label>
        <textarea
        className={s.bio}
          id="bio"
          placeholder='Enter your bio.'
          value={bio || ''}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="location">Location</label>
        <input
        className={s.input}
          id="location"
          type="text"
          placeholder='Ex: Austin, Texas'
          value={living_in || ''}
          onChange={(e) => setLivingIn(e.target.value)}
        />
      </div>
 
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="website">Website</label>
        <input
        className={s.input}
          id="website"
          type="website"
          placeholder='Ex: www.chess.com'
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
     
        <div className={s.buttons}>
       
        <div className={s.buttoncontainer}>
                
                <button
                  className={s.button}
                  onClick={() => updateProfile({ username, website,  firstname, lastname, bio,  living_in })}
                  disabled={loading}
                >
                  {loading ? 'Loading ...' : 'Update'}
                </button>
              </div>

              <div className={s.buttoncontainer}>
                <button
              className={s.button}
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </button>
              </div>
        </div>
      
      </div>
        </div>
    </div>
  )
}

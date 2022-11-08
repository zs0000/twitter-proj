import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import s from "./Account.module.css"
import { useRouter } from 'next/router'
export default function Account({ session }) {

  const current = new Date();
  const date = `${current.getFullYear()}/${current.getMonth()+1}/${current.getDate()}`;

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [bio, setBio] = useState(null)
  const [joinDate, setJoinDate] = useState(null)
  const [location, setLocation] = useState(null)
  const [birthday, setBirthday] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [postingImage, setPostingImage] = useState(false);
    const [imageSelected, setImageSelected] = useState(false);
    const [imageURL, setImageURL] = useState(null)

  const [signedUp, setSignedUp] = useState(null)
  const router = useRouter()
  useEffect(() => {
    getProfile()
  }, [session])

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!session?.user) {
      throw new Error('User not logged in')
    }

    return session.user
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, firstname, lastname, bio, join_date, living_in, birthday, completed_sign_up`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFirstName(data.firstname)
        setLastName(data.lastname)
        setBio(data.bio)
        setJoinDate(data.join_date)
        setLocation(data.living_in)
        setBirthday(data.birthday)
        setSignedUp(data.completed_sign_up)
    
        console.log(data)
       
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }


  async function updateProfile({ username, website, avatar_url, firstname, lastname, bio,  living_in, completed_sign_up }) {
    try {
      setLoading(true)
     
      const user = await getCurrentUser()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: "https://res.cloudinary.com/repdb/image/upload/v1667884387/anonyuser.jpg",
        header_url:"https://res.cloudinary.com/repdb/image/upload/v1631292432/spotlight2_m9cqji.jpg",
        firstname: firstName,
        lastname: lastName,
        bio,

        living_in: location,

        completed_sign_up: true,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setSignedUp(true)
      setLoading(false)
    }
  }

  if(signedUp === true){
    router.push('/home')
  }

  return (
    <div className={s.main}>
      <div className={s.welcomecontainer}>
        <span className={s.welcome}>Welcome!</span>
        
              
        <input className={s.fileupload} type="file" id="file_upload" onChange={(e)=> setImageSelected(e.target.files[0])}></input>
      </div>
      <div className={s.form}>
      <div className={s.inputcontainer}>
        <label className={s.label} htmlFor="email">Email</label>
        <input id="email" type="text" className={s.input} value={session.user.email} disabled />
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
          value={location || ''}
          onChange={(e) => setLocation(e.target.value)}
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
                  onClick={() => updateProfile({ username, website, avatar_url, firstname, lastname, bio,  location })}
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
  )
}
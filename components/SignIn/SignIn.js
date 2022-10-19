import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Login from '../Login/Login'
import Account from '../Account/Account'
import s from "./SignIn.module.css"
export default function SignIn({onClick}) {
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session)
        }

        setIsLoading(false)
      }
    }

    getInitialSession()

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      mounted = false

      subscription?.unsubscribe()
    }
  }, [])

  return (
    <div className={s.main}>
      <div className={s.background}>

      </div>
      <div className={s.login}>
      <Login />

      <button className={s.test} onClick={onClick}>test</button>
      </div>
     
    </div>
  )
}
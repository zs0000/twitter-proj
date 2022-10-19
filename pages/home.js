import Head from 'next/head'

import s from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

import SignedOut from '../components/SignedOut/SignedOut'
import { supabase } from '../utils/supabaseClient'
import Feed from '../components/Feed/Feed.js'
import Account from '../components/Account/Account'

export default function Home() {

  const [isOpen, setIsOpen] = useState(false);

  const handleSignInOpen = () => {
    if (isOpen){
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }
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
    <div className={s.container}>
      <Head>
        <title>Twitter</title>
        <meta name="description" content="a random description" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>

      {!session ? (
       <SignedOut />
      ) : (
       <Feed/>
      )}
    
      <footer className={s.footer}>
       
      </footer>
    </div>
  )
}

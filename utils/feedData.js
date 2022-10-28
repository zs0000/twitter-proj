import { createClient } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabaseClient'

const queryClient = useQueryClient();
const query = await useQuery(['content'], supabase
.from("posts")
.select("author, author_handle, posted_at, post_text"))
.eq('id', user.id)
.single()

export const getFeedContent = async() =>{
   query();
}
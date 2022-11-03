import { useQuery, useQueryClient } from 'react-query'
import { supabase } from './supabaseClient'

const getPostData = async (status) => {
  const { data, error } =  await supabase
  .from("posts")
  .select("author, author_handle, posted_at, post_text,id, post_id")
  .eq('post_id', status)
  .single()
    

  if(error) {
    console.error(error.message)
  }

  if(!data) {
    console.error("feed not found")
  }

  return data
}

export default function usePostData() {
    const {data, error} =  useQuery(`recentPostData`, () => getPostData())
  return data
}
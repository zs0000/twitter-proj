import { useQuery } from 'react-query'
import {supabase} from "./supabaseClient"

const getFeedContent = async () => {
  const { data, error } =  await supabase
  .from("posts")
  .select("author, author_handle, posted_at, post_text,id, post_id")
    

  if(error) {
    console.error(error.message)
  }

  if(!data) {
    console.error("feed not found")
  }

  return data
}

export default function useFeedContent() {

  return useQuery('feedContent', () => getFeedContent())
}
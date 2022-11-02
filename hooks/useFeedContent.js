import { useQuery, useQueryClient } from 'react-query'
import { supabase } from '../utils/supabaseClient'



export default function useFeedContent() {

  return useQuery('feedContent', () => getFeedContent())
}
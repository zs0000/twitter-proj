import '../styles/globals.css'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { PostContextProvider } from '../context/PostContext'
const queryClient = new QueryClient()
function MyApp({ Component, pageProps }) {
  return (<QueryClientProvider client={queryClient}>
    <PostContextProvider>


    <Component {...pageProps} />
    </PostContextProvider>
  </QueryClientProvider>)
}

export default MyApp

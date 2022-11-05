import '../styles/globals.css'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { PostContextProvider } from '../context/PostContext'
import { UserContextProvider } from '../context/UserContext'

const queryClient = new QueryClient()
function MyApp({ Component, pageProps }) {
  return (<QueryClientProvider client={queryClient}>
    <PostContextProvider>
      <UserContextProvider>


    <Component {...pageProps} />
    </UserContextProvider>
    </PostContextProvider>
  </QueryClientProvider>)
}

export default MyApp

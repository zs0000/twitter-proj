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
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient()
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (<QueryClientProvider client={queryClient}>
    <PostContextProvider>
      <UserContextProvider>

      <Toaster />
    <Component key={router.asPath} {...pageProps} />
    </UserContextProvider>
    </PostContextProvider>
  </QueryClientProvider>)
}

export default MyApp

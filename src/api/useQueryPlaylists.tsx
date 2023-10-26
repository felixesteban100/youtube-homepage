import { URL_CLERK_API, apiKey, clerkSecretKey, REACT_QUERY_DEFAULT_PROPERTIES } from '@/data/constants'
import useLocalStorage from '@/hooks/useLocalStorage'
import { YouTubePlaylistListResponse } from '@/utils/types'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

function useQueryPlaylists() {
    const { isLoaded, isSignedIn, userId } = useAuth()
    const [currentPlaylists, setCurrentUserPlaylists] = useLocalStorage<YouTubePlaylistListResponse | null>("YOUTUBE_PLAYLISTS", null)
    const { isLoading: isLoadingPlaylists, isError: isErrorPlaylists, data: allPlaylists } = useQuery<YouTubePlaylistListResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        enabled: currentPlaylists === null && (isSignedIn === true && isLoaded === true),
        queryKey: ["YouTubeApiPlaylists"],
        queryFn: async () => {
            if (!apiKey) {
                throw "Missing Publishable Key";
            }
            const responseApiBecauseClerkIsBadService = await axios.get<YouTubePlaylistListResponse>(`${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${userId}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=playlists`);
            return responseApiBecauseClerkIsBadService.data
        },
        onSuccess: (data) => {
            setCurrentUserPlaylists(data)
        }
    })

    return { isLoadingPlaylists, isErrorPlaylists, allPlaylists, currentPlaylists, setCurrentUserPlaylists }
}

export default useQueryPlaylists
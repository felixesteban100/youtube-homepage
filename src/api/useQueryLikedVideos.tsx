import { API_URL_CHANNELS, URL_CLERK_API, apiKey, clerkSecretKey, REACT_QUERY_DEFAULT_PROPERTIES } from '@/data/constants'
import useLocalStorage from '@/hooks/useLocalStorage'
import { ChannelInfoResponse, VideoItem, YouTubeVideoListResponse } from '@/utils/types'
import { useCurrentUser } from '@/state/currentUser'
import { useQuery } from 'react-query'
import axios from 'axios'

function useQueryLikedVideos() {
    const { currentUser } = useCurrentUser(state => state)
    const [likedVideos, setLikedVideos] = useLocalStorage<YouTubeVideoListResponse | null>("YOUTUBE_LIKEDVIDEOS", null)
    const [nextPageTokenLiked, setNextPageTokenLiked] = useLocalStorage<string>("YOUTUBE_NEXTPAGETOKENLIKEDVIDEOS", "")

    const { isLoading: isLoadingLikedVideos, isError: isErrorLikedVideos, data: allLikedVideos, refetch: refetchLikedVideos, isFetching: isFetchingLikedVideos } = useQuery<YouTubeVideoListResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        enabled: currentUser.id !== "" && ((likedVideos !== null && likedVideos?.items.length < likedVideos?.pageInfo.totalResults) || likedVideos === null),
        queryKey: ["YouTubeApiLikedVideos"],
        queryFn: async () => {
            if (!apiKey) throw "Missing Publishable Key";

            const configVideos = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${currentUser.id}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=likedVideos${nextPageTokenLiked !== "" ? `&nextPageToken=${nextPageTokenLiked}` : ""}`,
            };
            const responseLikedVideos = await axios.request<YouTubeVideoListResponse>(configVideos).then(async (dataLikedVideos) => {
                const videosWithChannelInfoPromise: Promise<VideoItem>[] = await dataLikedVideos.data.items.map(async (video) => {
                    const configChannel = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${API_URL_CHANNELS}?part=snippet%2CcontentDetails%2Cstatistics&id=${video.snippet.channelId}&key=${apiKey}`,
                    };
                    const responseChannel = await axios.request<ChannelInfoResponse>(configChannel).then(data => data.data);
                    return { ...video, channelInfo: responseChannel }
                })
                return {
                    ...dataLikedVideos.data,
                    items: await Promise.all(videosWithChannelInfoPromise).then((value) => value)
                }
            });
            return responseLikedVideos
        },
        onSettled: (data) => {
            if (data) {
                if (data.nextPageToken) setNextPageTokenLiked(data.nextPageToken)
                if (!data.nextPageToken) setNextPageTokenLiked("")

                setLikedVideos(prev => {
                    return prev !== null ? {
                        ...data,
                        items: [...prev.items, ...data.items]
                    } : data
                })
            }
        },
    })

    return { isLoadingLikedVideos, isErrorLikedVideos, allLikedVideos, likedVideos, setLikedVideos, refetchLikedVideos, isFetchingLikedVideos, nextPageTokenLiked, setNextPageTokenLiked }
}

export default useQueryLikedVideos
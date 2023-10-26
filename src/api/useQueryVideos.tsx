import useLocalStorage from '@/hooks/useLocalStorage'
import { useSearchParamsForTheApp } from '@/hooks/useSearchParamsForTheApp'
import { useState } from 'react'
import axios from 'axios'
import { API_URL_CHANNELS, API_URL_VIDEOS, REACT_QUERY_DEFAULT_PROPERTIES, apiKey } from '@/data/constants'
import { useQuery } from 'react-query'
import { ChannelInfoResponse, VideoItem, YouTubeVideoListResponse } from '@/utils/types'

function useQueryVideos() {
    const { searchParams } = useSearchParamsForTheApp()
    const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([])
    const [nextPageToken, setNextPageToken] = useLocalStorage<string>("YOUTUBE_NEXTPAGETOKEN", "")
    
    const { isLoading: isLoadingVideos, isError: isErrorVideos, data: allVideos, refetch: refetchAllVideos, isFetching: isFetchingVideos } = useQuery<YouTubeVideoListResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        queryKey: ["YouTubeApiVideos"],
        queryFn: async () => {
            if (!apiKey) throw "Missing Publishable Key";

            const configVideos = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${API_URL_VIDEOS}?part=snippet%2CcontentDetails%2Cstatistics%2Cplayer&maxResults=50&chart=mostPopular${nextPageToken !== "" ? `&pageToken=${nextPageToken}` : ""}&regionCode=US${searchParams.category_id !== 999 ? `&videoCategoryId=${searchParams.category_id}` : ""}&key=${apiKey}`,
            }

            const responseVideos = await axios.request<YouTubeVideoListResponse>(configVideos).then(async (dataVideos) => {
                const videosWithChannelInfoPromise: Promise<VideoItem>[] = await dataVideos.data.items.map(async (video) => {
                    const configChannel = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${API_URL_CHANNELS}?part=snippet%2CcontentDetails%2Cstatistics&id=${video.snippet.channelId}&key=${apiKey}`,
                    };
                    const responseChannel = await axios.request<ChannelInfoResponse>(configChannel).then(data => data.data);
                    return { ...video, channelInfo: responseChannel }
                })

                return {
                    ...dataVideos.data,
                    items: await Promise.all(videosWithChannelInfoPromise).then((value) => value)
                }
            });
            return responseVideos
        },
        onSettled: (data) => {
            if (data && data.nextPageToken) setNextPageToken(data.nextPageToken)
            if (data && !data.nextPageToken) setNextPageToken("")
            if (data) setShuffledVideos(data.items.sort(() => 0.5 - Math.random()))
        },
    })

    return { isLoadingVideos, isErrorVideos, allVideos, shuffledVideos, refetchAllVideos, isFetchingVideos, nextPageToken, setNextPageToken }
}

export default useQueryVideos
import { useState, useEffect } from 'react'
import CategoryPills from "./components/CategoryPills"
import PageHeader from "./layouts/PageHeader"
import VideoGridItems from './components/VideoGridItems'
import SideBar from './layouts/SideBar'
import { SidebarProvider } from './contexts/SidebarContext'
import { API_URL_CHANNELS, API_URL_VIDEOS, DEFAULT_SEARCHPARAMS, REACT_QUERY_DEFAULT_PROPERTIES, apiKey, getSearchParamsFormatted } from './data/constants'
import axios from "axios"
import { ChannelInfoResponse, VideoItem, YouTubeVideoListResponse } from './utils/types'
import { useQuery } from 'react-query'
import VideoGridLoadingItems from './components/VideoGridLoadingItems'
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
import { queryClient } from './main'

//https://developers.google.com/youtube/v3/docs
//https://console.cloud.google.com/apis/credentials?project=youtube-production-402002

function App() {
  const [searchParams, setSearchParams] = useSearchParams(JSON.parse(localStorage.getItem("YOUTUBE_SEARCHPARAMS") ?? JSON.stringify(DEFAULT_SEARCHPARAMS)))
  const { category_name, category_id } = getSearchParamsFormatted(searchParams)

  const [nextPageToken, setNextPageToken] = useLocalStorage("YOUTUBE_NEXTPAGETOKEN", "")

  const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([])

  const { isLoading: isLoadingVideos, isError: isErrorVideos, data: allVideos, refetch: refetchAllVideos, isFetching: isFetchingVideos } = useQuery<YouTubeVideoListResponse>({
    ...REACT_QUERY_DEFAULT_PROPERTIES,
    queryKey: ["YouTubeApiVideos"],
    queryFn: async () => {
      if (!apiKey) throw "Missing Publishable Key";

      const configVideos = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API_URL_VIDEOS}?part=snippet%2CcontentDetails%2Cstatistics%2Cplayer&maxResults=50&chart=mostPopular${nextPageToken !== "" ? `&pageToken=${nextPageToken}` : ""}&regionCode=US${category_id !== 999 ? `&videoCategoryId=${category_id}` : ""}&key=${apiKey}`,
      };

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

  useEffect(() => localStorage.setItem("CHARACTERS_APP_SEARCHPARAMS", JSON.stringify(getSearchParamsFormatted(searchParams))), [searchParams]);

  useEffect(() => {
    if (isLoadingVideos) {
      setTimeout(() => {
        queryClient.cancelQueries(["YouTubeApiVideos"])
      }, 7000)
    }
  })

  function setCategoryNameAndIdOnSearchParams(category_name: string, category_id: string) {
    setSearchParams((prev) => {
      prev.set("category_name", category_name)
      prev.set("category_id", category_id)
      return prev
    })

    refetchAllVideos()
  }

  return (
    <SidebarProvider>
      <div className="max-h-screen flex flex-col">
        <PageHeader />
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <SideBar />
          <Routes>
            <Route
              path="/"
              element={
                <div className='overflow-x-hidden px-8 pb-4'>
                  <div className="sticky top-0 bg-background z-10 pb-4">
                    <CategoryPills
                      categoryNameSeachParams={category_name}
                      setCategoryNameAndIdOnSearchParams={setCategoryNameAndIdOnSearchParams}
                    />
                  </div>
                  {
                    isLoadingVideos || isFetchingVideos ?
                      <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
                        {new Array(20).fill(0).map((_, index) => {
                          return (
                            <VideoGridLoadingItems
                              key={index}
                            />
                          )
                        })}
                      </div>
                      : isErrorVideos || allVideos === undefined ?
                        <p className='text-xl text-center'>Something went wrong fetching videos 😥</p>
                        : <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
                          {shuffledVideos.map(video => {
                            return (
                              <VideoGridItems
                                key={video.id}
                                {...video}
                              />
                            )
                          })}
                        </div>
                  }
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App
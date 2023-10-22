import { useState, useEffect } from 'react'
import CategoryPills from "./components/CategoryPills"
import PageHeader from "./layouts/PageHeader"
import VideoGridItems from './components/VideoGridItems'
import SideBar from './layouts/SideBar'
import { SidebarProvider } from './contexts/SidebarContext'
import { API_URL_CHANNELS, API_URL_VIDEOS, DEFAULT_SEARCHPARAMS, REACT_QUERY_DEFAULT_PROPERTIES, URL_CLERK_API, apiKey, clerkSecretKey, getSearchParamsFormatted } from './data/constants'
import axios from "axios"
import { ChannelInfoResponse, VideoItem, YouTubeVideoListResponse } from './utils/types'
import { useQuery } from 'react-query'
import VideoGridLoadingItems from './components/VideoGridLoadingItems'
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
// import { queryClient } from './main'
// import { useUser } from '@clerk/clerk-react'
import LikedVideoGridItems from './components/LikedVideoGridItems'
import LikedVideosCategoryPills from './components/LikedVideosCategoryPills'
import { Button } from './components/ui/button'
import { Play, Shuffle } from 'lucide-react'

//https://developers.google.com/youtube/v3/docs
//https://console.cloud.google.com/apis/credentials?project=youtube-production-402002

function App() {
  // const { user } = useUser()

  const [searchParams, setSearchParams] = useSearchParams(JSON.parse(localStorage.getItem("YOUTUBE_SEARCHPARAMS") ?? JSON.stringify(DEFAULT_SEARCHPARAMS)))
  const { category_name, category_id } = getSearchParamsFormatted(searchParams)

  const [nextPageToken, setNextPageToken] = useLocalStorage("YOUTUBE_NEXTPAGETOKEN", "")
  const [nextPageTokenLiked, setNextPageTokenLiked] = useLocalStorage("YOUTUBE_NEXTPAGETOKENLIKEDVIDEOS", "")
  const [likedVideos, setLikedVideos] = useLocalStorage<VideoItem[]>("YOUTUBE_LIKEDVIDEOS", [])
  
  const [currentUserId, setCurrentUserId] = useLocalStorage<string>("YOUTUBE_USERID", "")
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

  const { isLoading: isLoadingLikedVideos, isError: isErrorLikedVideos,/*  data: allLikedVideos, */ refetch: refetchLikedVideos/* , isFetching: isFetchingLikedVideos */ } = useQuery<YouTubeVideoListResponse>({
    ...REACT_QUERY_DEFAULT_PROPERTIES,
    enabled: currentUserId !== "",
    queryKey: ["YouTubeApiLikedVideos"],
    queryFn: async () => {
      if (!apiKey) throw "Missing Publishable Key";

      const configVideos = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${currentUserId}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=likedVideos${nextPageTokenLiked !== "" ? `&nextPageToken=${nextPageTokenLiked}` : ""}`,
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
      if (data && data.nextPageToken) setNextPageTokenLiked(data.nextPageToken)
      if (data && !data.nextPageToken) setNextPageTokenLiked("")
      if (data) {
        setShuffledVideos(data.items.sort(() => 0.5 - Math.random()))
        setLikedVideos(prev => {
          return [...prev, ...data.items]
        })
      }
    },
  })

  // useEffect(() => {
  //   if(pathname !== "/liked"){
  //     refetchAllVideos()
  //   }else if(typeof userId === "string" && pathname === "/liked"){
  //     refetchAllVideos()
  //   }
  //   setNextPageToken("")
  // }, [pathname])

  useEffect(() => localStorage.setItem("YOUTUBE_SEARCHPARAMS", JSON.stringify(getSearchParamsFormatted(searchParams))), [searchParams]);

  /* useEffect(() => {
    if (isLoadingVideos) {
      setTimeout(() => {
        queryClient.cancelQueries(["YouTubeApiVideos"])
      }, 15000)
    }
  }) */

  function setCategoryNameAndIdOnSearchParams(category_name: string, category_id: string) {
    setSearchParams((prev) => {
      prev.set("category_name", category_name)
      prev.set("category_id", category_id)
      prev.set("sideBarOptionSelected", "Home")
      return prev
    })
    refetchAllVideos()
  }

  return (
    <SidebarProvider>
      <div className="max-h-screen flex flex-col">
        <PageHeader 
          setCurrentUserId={setCurrentUserId}
        />
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
                          return <VideoGridLoadingItems key={index} />
                        })}
                      </div>
                      : isErrorVideos || allVideos === undefined ?
                        <p className='text-xl text-center'>Something went wrong fetching videos 😥</p>
                        :
                        <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
                          {shuffledVideos.map(video => {
                            return <VideoGridItems key={video.id} {...video} />
                          })}
                        </div>
                  }
                </div>
              }
            />
            <Route
              path="/liked"
              element={
                <div className='overflow-x-hidden pl-8 pb-4 flex'>
                  {
                    allVideos !== undefined && likedVideos.length > 0 && isErrorVideos === false ?
                      <div className='mt-5 rounded-xl flex-col sticky top-0 overflow-hidden hidden xl:flex justify-start pt-5 gap-10 items-center'>
                        <img className='blur-3xl h-[70vh] w-[20vw]' src={likedVideos[0].snippet.thumbnails.high.url} alt="" />
                        <div className='absolute w-[90%] flex flex-col gap-2'>
                          <img className='mx-auto left-[25%] rounded-xl' src={likedVideos[0].snippet.thumbnails.high.url} alt="" />
                          <p className='text-3xl font-bold'>Liked Videos</p>
                          {/* <p className='font-bold'>{user?.fullName}</p> */}
                          <div className='flex gap-2'>
                            <p className='text-sm'>{likedVideos.length + 1} Videos</p>
                            <p className='text-sm'>Last Sign in - {new Date().toDateString()}</p>
                          </div>
                          <div className='flex flex-row gap-5 my-5 w-full'>
                            <Button className='rounded-l-full rounded-r-full w-full flex gap-1'><Play />Play ALL</Button>
                            <Button onClick={nextPageToken !== "" ? () => refetchLikedVideos() : () => { }} className='rounded-l-full rounded-r-full w-full bg-secondary/50 flex gap-1' variant={nextPageToken !== "" ? 'secondary' : "destructive"}><Shuffle />Shuffle</Button>
                          </div>
                        </div>
                      </div>
                      :
                      null
                  }

                  {
                    isLoadingLikedVideos && likedVideos.length === 0 /* || isFetchingVideos */ ?
                      // <p>Loading...</p>
                      null
                      : isErrorLikedVideos && likedVideos.length === 0 /* || allVideos === undefined */ ?
                        <p className='text-xl text-center'>Something went wrong fetching liked videos 😥</p>
                        :
                        <div className='flex-grow overflow-y-auto grid gap-4 grid-cols-1 xl:w-[60vw] bg-background/100'>
                          <div className="block sticky top-0 bg-background z-10 pl-5 pt-5 pb-4">
                            <LikedVideosCategoryPills />
                          </div>
                          {likedVideos.map((video, index) => {
                            return <LikedVideoGridItems key={video.id} {...video} index={index} />
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



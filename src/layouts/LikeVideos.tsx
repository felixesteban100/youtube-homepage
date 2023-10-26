import LikedVideoGridItems from '../components/LikedVideoGridItems'
import LikedVideosCategoryPills from '../components/LikedVideosCategoryPills'
import { Button } from '../components/ui/button'
import { Play, Shuffle } from 'lucide-react'
import useQueryLikedVideos from '@/api/useQueryLikedVideos'
import { useCurrentUser } from '@/state/currentUser'
import { useEffect } from 'react'

type LikeVideosProps = {}

function LikeVideos({ }: LikeVideosProps) {
    const { isLoadingLikedVideos, isErrorLikedVideos, refetchLikedVideos, likedVideos, nextPageTokenLiked } = useQueryLikedVideos()
    const { currentUser } = useCurrentUser(state => state)

    useEffect(() => {
        if (nextPageTokenLiked !== "") {
            refetchLikedVideos()
        }
    }, [nextPageTokenLiked])

    return (
        <div className='overflow-x-visible lg:overflow-x-hidden pl-8 pb-4 flex flex-col lg:flex-row'>
            {
                likedVideos !== null ?
                    <div className='w-[25rem] flex-shrink-0 mt-5 rounded-xl flex-col sticky top-0 overflow-hidden hidden lg:flex justify-start pt-5 gap-10 items-center'>
                        <img className='blur-3xl h-[70vh] w-[20vw] object-cover aspect-video' src={likedVideos.items[0].snippet.thumbnails.high.url} alt="" />
                        <div className='absolute w-[90%] flex flex-col gap-2'>
                            <img className='aspect-video object-cover mx-auto left-[25%] rounded-xl' src={likedVideos.items[0].snippet.thumbnails.high.url} alt="playlist_thumbnail" />
                            <p className='text-3xl font-bold'>Liked Videos</p>
                            <p className='font-bold mt-2'>{currentUser.name}</p>
                            <div className='flex gap-2'>
                                <p className='text-sm'>{likedVideos.items.length} {likedVideos.pageInfo.totalResults} Videos</p>
                                <p className='text-sm'>Last Sign in - {new Date().toDateString()}</p>
                            </div>
                            <div className='flex flex-row gap-5 my-5 w-full'>
                                <Button className='rounded-l-full rounded-r-full w-full flex gap-1'><Play />Play ALL</Button>
                                <Button className='rounded-l-full rounded-r-full w-full bg-secondary/50 flex gap-1' variant={'secondary'}><Shuffle />Shuffle</Button>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }

            {
                likedVideos !== null ?
                    <div className='h-[40vh] md:h-[25vh] flex lg:hidden justify-around pt-5 gap-10 items-center relative'>
                        <img className='blur-3xl aspect-video ml-[10%] w-[100vw] h-[20vh] md:h-[15vh] object-cover' src={likedVideos.items[0].snippet.thumbnails.high.url} alt="" />
                        <div className='absolute w-[100%] flex flex-col md:flex-row justify-start items-center gap-5'>
                            <img className='aspect-video h-[12rem] object-cover rounded-xl' src={likedVideos.items[0].snippet.thumbnails.high.url} alt="playlist_thumbnail" />
                            <div className='flex flex-col'>
                                <p className='text-3xl font-bold'>Liked Videos</p>
                                <p className='font-bold mt-2'>{currentUser.name}</p>
                                <div className='flex flex-row gap-2'>
                                    <p className='text-sm'>{likedVideos.items.length} {likedVideos.pageInfo.totalResults} Videos</p>
                                    <p className='text-sm'>Last Sign in - {new Date().toDateString()}</p>
                                </div>
                                <div className='flex flex-row gap-5 my-5 w-full'>
                                    <Button className='rounded-l-full rounded-r-full w-full flex gap-1'><Play />Play ALL</Button>
                                    <Button className='rounded-l-full rounded-r-full w-full bg-secondary/50 flex gap-1' variant={'secondary'}><Shuffle />Shuffle</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }

            {
                isLoadingLikedVideos && likedVideos === null ?
                    null
                    : isErrorLikedVideos ?
                        <p className='text-xl text-center'>Something went wrong fetching liked videos 😥</p>
                        :
                        likedVideos === null ?
                            <p>No liked videos</p>
                            :
                            <div className='flex-grow overflow-y-auto grid gap-4 grid-cols-1 xl:w-[60vw] bg-background/100'>
                                <div className="block sticky top-0 bg-background z-10 pl-5 pt-5 pb-4">
                                    <LikedVideosCategoryPills />
                                </div>
                                {likedVideos.items.map((video, index) => {
                                    return <LikedVideoGridItems key={video.id} {...video} index={index} />
                                })}
                            </div>
            }
        </div>
    )
}

export default LikeVideos
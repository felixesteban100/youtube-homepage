import useQueryVideos from '@/api/useQueryVideos'
import VideoGridLoadingItems from '../components/VideoGridLoadingItems'
import CategoryPills from '@/components/CategoryPills'
import VideoGridItems from '@/components/VideoGridItems'

type HomeVideosProps = {}

function HomeVideos({ }: HomeVideosProps) {
    const { isLoadingVideos, isFetchingVideos, isErrorVideos, allVideos, shuffledVideos } = useQueryVideos()

    return (
        <div className='overflow-x-hidden px-8 pb-4'>
            <div className="sticky top-0 bg-background z-10 pb-4">
                <CategoryPills />
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
    )
}

export default HomeVideos
import { useState, useRef, useEffect } from 'react'
import { formatDuration } from '../utils/formatDuration';
import { formatTimeAgo } from '../utils/formatTimeAgo';

type VideoGridItemsProps = {
    id: string;
    title: string;
    channel: {
        id: string;
        name: string;
        profileUrl: string
    }
    views: number;
    postedAt: Date;
    duration: number;
    thumbnailUrl: string
    videoUrl: string
}

const VIEW_FORMATTER = Intl.NumberFormat(undefined, {
    notation: "compact"
})

function VideoGridItems({ id, title, channel, views, postedAt, duration, thumbnailUrl, videoUrl }: VideoGridItemsProps) {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current == null) return
        if (isVideoPlaying /* && !videoRef.current?.paused */) {
            videoRef.current.currentTime = 0
            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }, [isVideoPlaying])

    return (
        <div className='flex flex-col gap-2'
            onMouseEnter={() => setIsVideoPlaying(true)}
            onMouseLeave={() => setIsVideoPlaying(false)}
        >
            <a
                href={`/watch?v=${id}`}
                className='relative aspect-video'
            >
                <img src={thumbnailUrl} className={`block w-full h-full object-cover transition-[border-radius] duration-200 ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`} />
                <div className='absolute bottom-1 right-1 bg-background text-background-foreground text-sm px-0.5 rounded'>
                    {formatDuration(duration)}
                </div>
                <video
                    className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                    ref={videoRef}
                    src={videoUrl}
                    // muted
                    playsInline
                />
            </a>
            <div
                className={`flex gap-2`}
            >
                <a
                    href={`/@${channel.id}`}
                    className='flex-shrink-0'
                >
                    <img
                        src={channel.profileUrl}
                        className='w-12 h-12 rounded-full'
                    />
                </a>
                <div className='flex flex-col'>
                    <a
                        href={`/watch?v=${id}`}
                        className='font-bold'
                    >
                        {title}
                    </a>
                    <a
                        href={`/@${channel.id}`}
                        className='text-background-foreground text-sm'
                    >
                        {channel.name}
                    </a>
                    <div className='text-background-foreground text-sm'>
                        {VIEW_FORMATTER.format(views)} Views · {formatTimeAgo(postedAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoGridItems


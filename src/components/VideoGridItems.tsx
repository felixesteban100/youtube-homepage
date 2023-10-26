// import { useState, useRef, useEffect } from 'react'
// import { formatDuration } from '../utils/formatDuration';
import { formatTimeAgo } from '../utils/formatTimeAgo';
import { VideoItem } from '@/utils/types';
import { iso8601DurationToTime } from '@/utils/iso8601DurationToTime';
import { AspectRatio } from "@/components/ui/aspect-ratio"

/* type VideoGridItemsProps = {
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
} */

type VideoGridItemsProps = VideoItem

const VIEW_FORMATTER = Intl.NumberFormat(undefined, {
    notation: "compact"
})

function VideoGridItems({ /* kind, */ contentDetails, /* etag, */ id, snippet, statistics, channelInfo/* , player */ }: VideoGridItemsProps) {
    // const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    // // const videoRef = useRef<HTMLVideoElement>(null)
    // const videoRef = useRef<HTMLIFrameElement>(null)

    // const regex = /"(?:https?:)?\/\/www\.youtube\.com\/embed\/([^"]+)"/;
    // const match = player.embedHtml.match(regex);
    // console.log(player.embedHtml)
    // if (match) console.log(match[0].slice(3, match[0].length - 1))

    // console.log(channelInfo.items[0].snippet.thumbnails)

    // you know the react hook(() => {
    //     if (videoRef.current == null) return
    //     if (isVideoPlaying /* && !videoRef.current?.paused */) {
    //         // videoRef.current.currentTime = 0
    //         // videoRef.current.play()
    //         // videoRef.current.
    //     } else {
    //         // videoRef.current.pause()
    //     }
    // }, [isVideoPlaying])

    return (
        <div className='flex flex-col gap-2'
            // onMouseEnter={() => setIsVideoPlaying(true)}
            // onMouseLeave={() => setIsVideoPlaying(false)}
        >
            <a
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                className='relative '
            // className='relative h-[20vh] sm:h-[35vh] md:h-[30vh] xl:h-[18.2vh]'
            // className='relative aspect-video max-h-[11rem] sm:max-h-[12vh] md:max-h-[25vh] lg:h-[14.2rem] xl:max-h-[11rem]'
            >
                <AspectRatio ratio={16 / 9}>
                    <img
                        style={{ boxShadow: 'none', borderImage: '' }}
                        src={snippet.thumbnails.high.url}
                        // className={`block w-full h-full object-cover transition-[border-radius] duration-200 ${isVideoPlaying ? "rounded-none" : "rounded-xl"}`}
                        className={`block w-full h-full object-cover transition-[border-radius] duration-200 rounded-xl`}
                    />
                </AspectRatio>
                <div className='absolute bottom-1 right-1 bg-background text-background-foreground text-sm px-0.5 rounded'>
                    {iso8601DurationToTime(contentDetails.duration).length <= 2 ? `00:${iso8601DurationToTime(contentDetails.duration)}` : iso8601DurationToTime(contentDetails.duration)}
                </div>

                {/*  <iframe
                        className={`w-[18rem] block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                        title="YouTube video player"
                        width="640"
                        height="390"
                        allowFullScreen
                        src={match ? match[0].slice(3, match[0].length - 1) : ''}
                        ref={videoRef as any}
                        picture-in-picture
                        >
                    </iframe> */}
                {/* {isVideoPlaying ?
                    <div
                        className={`w-[18rem] block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                    >
                        {player.embedHtml}
                    </div>
                    :
                    null
                } */}


                {/* <AspectRatio ratio={16 / 9}>
                    <div
                        className={`w-[5rem] block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                        dangerouslySetInnerHTML={{ __html: player.embedHtml }}
                    >
                    </div>
                </AspectRatio> */}

                {/* {
                    match ?
                        <iframe
                            className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 delay-200 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                            ref={videoRef}
                            src={match[0].slice(3, match[0].length - 1)}
                            // dangerouslySetInnerHTML={{ __html: player.embedHtml }}
                            // muted
                            // playsInline
                        ></iframe>
                        : null
                } */}
            </a>
            <div
                className={`flex gap-2`}
            >
                <a
                    href={`https://www.youtube.com/${channelInfo.items[0].snippet.customUrl}`}
                    target="_blank"
                    className='flex-shrink-0'
                >
                    <img
                        src={channelInfo.items[0].snippet.thumbnails.high.url}
                        className='w-12 h-12 rounded-full'
                    />
                    {/* <div
                        className='w-12 h-12 rounded-full bg-secondary border-2 border-accent-foreground/50'
                    /> */}
                </a>
                <div className='flex flex-col'>
                    <a
                        href={`https://www.youtube.com/watch?v=${id}`}
                        target="_blank"
                        className='font-bold'
                    >
                        {snippet.title}
                    </a>
                    <a
                        href={`https://www.youtube.com/${channelInfo.items[0].snippet.customUrl}`}
                        target="_blank"
                        className='text-background-foreground text-sm hover:font-bold'
                    >
                        {snippet.channelTitle}
                    </a>
                    <div className='text-background-foreground text-sm'>
                        {VIEW_FORMATTER.format(parseInt(statistics.viewCount))} Views · {formatTimeAgo(new Date(snippet.publishedAt))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoGridItems






/* 
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
                    muted
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
*/


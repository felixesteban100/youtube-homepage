import { formatTimeAgo } from '../utils/formatTimeAgo';
import { VideoItem } from '@/utils/types';

type LikedVideoGridItemsProps = VideoItem & {
    index: number
}

const VIEW_FORMATTER = Intl.NumberFormat(undefined, {
    notation: "compact"
})

function LikedVideoGridItems({ id, snippet, statistics, channelInfo, index }: LikedVideoGridItemsProps) {
    return (
        <div
            // href={`https://www.youtube.com/watch?v=${id}`}
            // target="_blank"
            className='flex justify-center items-center gap-5 hover:bg-accent py-2 px-5 rounded-xl'
        >
            <div className='flex-shrink-0 flex items-center gap-2'>
                <p >{index + 1}</p>
                <img
                    src={snippet.thumbnails.high.url}
                    // className={`h-full object-cover transition-[border-radius] duration-200 rounded-xl`}
                    className={`h-[5rem] w-36 object-cover transition-[border-radius] duration-200 rounded-xl`}
                />
            </div>
            <div className='flex-grow flex flex-col'>
                <a
                    href={`https://www.youtube.com/watch?v=${id}`}
                    target="_blank"
                    className='font-bold '
                >
                    {snippet.title}
                </a>
                <div className='flex justify-start gap-1'>
                    <a
                        href={`https://www.youtube.com/${channelInfo.items[0].snippet.customUrl}`}
                        target="_blank"
                        className='text-background-foreground text-sm hover:font-bold'
                    >
                        {snippet.channelTitle} ·
                    </a>
                    <div className='text-background-foreground text-sm hidden md:block'>
                        {VIEW_FORMATTER.format(parseInt(statistics.viewCount))} Views · {formatTimeAgo(new Date(snippet.publishedAt))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LikedVideoGridItems
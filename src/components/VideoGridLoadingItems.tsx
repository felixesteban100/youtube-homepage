
function VideoGridLoadingItems() {
    return (
        <div className='flex flex-col gap-2 animate-pulse'
        >
            <a
                // className='relative h-[20vh] sm:h-[35vh] md:h-[30vh] xl:h-[18.2vh]'
                className='relative aspect-video'
            >
                <div className={`block w-full h-full bg-primary/20 border-accent-foreground/50 transition-[border-radius] duration-200 `} />
            </a>
            <div
                className={`flex gap-2 w-full`}
            >
                <div
                    className='w-12 h-12 rounded-full bg-primary/20 '
                />
                <div className='flex flex-col gap-2 flex-grow'>
                    <div
                        className='font-bold bg-primary/20 h-8 w-[90%] rounded-md'
                    />
                    <div
                        className='text-background-foreground text-sm bg-primary/20  h-8 w-[70%] rounded-md'
                    />
                </div>
            </div>
        </div>
    )
}

export default VideoGridLoadingItems


import { Button } from "./ui/button"

function LikedVideosCategoryPills() {
    return (
        <div className="overflow-x-hidden relative bg-background">
            <div
                className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]"
            >
                <>
                    <Button
                        variant={"default"}
                    >
                        All
                    </Button>
                    <Button
                        variant={'secondary'}
                    >
                        Videos
                    </Button>
                    <Button
                        variant={'secondary'}
                    >
                        Shorts
                    </Button>
                </>
            </div>
        </div>
    )
}

export default LikedVideosCategoryPills
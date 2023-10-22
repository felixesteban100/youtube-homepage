import { ChevronDown, ChevronUp, MailCheck, Clock, Home, BookMarked, PlaySquare, Repeat, History, ListVideo, Flame, ShoppingBag, Music2, Film, Radio, Gamepad2, Newspaper, Trophy, Lightbulb, Shirt, Podcast, ThumbsUp, User } from "lucide-react"
import { ElementType } from 'react'
import Button, { buttonStyles } from '../components/Button'
import { twMerge } from 'tailwind-merge'
import React, { ReactNode, useState } from 'react'
import { playlists, subscriptions } from "../data/sidebar"
import { useSidebarContext } from "../contexts/SidebarContext"
import { PageHeaderFirstSection } from "./PageHeader"
import { ChannelInfoResponse, YouTubePlaylistListResponse, YouTubeSubscription, YouTubeSubscriptionResponse } from "@/utils/types"
import { useQuery } from 'react-query'
import { API_URL_CHANNELS, REACT_QUERY_DEFAULT_PROPERTIES, URL_CLERK_API, apiKey, clerkSecretKey } from '../data/constants'
import axios from 'axios'
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useEffect } from 'react'
import { queryClient } from "@/main"
import { useLocation, Link } from "react-router-dom"
import useLocalStorage from "@/hooks/useLocalStorage"

type SideBarProps = {}

// apply this to the youtube api
// https://www.youtube.com/watch?v=IAZLgLyFDJg&ab_channel=Joshtriedcoding

function SideBar({ }: SideBarProps) {
    const { pathname } = useLocation()

    const { isLargeOpen, isSmallOpen, close } = useSidebarContext()
    const { isLoaded, isSignedIn, userId } = useAuth()

    const [currentSubscriptions, setCurrentUserSubscriptions] = useLocalStorage<YouTubeSubscriptionResponse | null>("YOUTUBE_SUBSCRIPTIONS", null)
    const [currentPlaylists, setCurrentUserPlaylists] = useLocalStorage<YouTubePlaylistListResponse | null>("YOUTUBE_PLAYLISTS", null)

    const { isLoading: isLoadingSubscriptions, isError: isErrorSubscriptions/* , data: allSubscriptions */ } = useQuery<YouTubeSubscriptionResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        enabled: (isSignedIn !== undefined && isSignedIn === true && isLoaded === true),
        queryKey: ["YouTubeApiSubscription"],
        queryFn: async () => {
            if (!apiKey) {
                throw "Missing Publishable Key";
            }
            const responseApiBecauseClerkIsBadService = await axios.get<YouTubeSubscriptionResponse>(`${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${userId}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=subscriptions`).then(async (dataSubscription) => {
                const subscriptionsWithChannelInfoPromise: Promise<YouTubeSubscription>[] = await dataSubscription.data.items.map(async (subscription) => {
                    const configChannel = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${API_URL_CHANNELS}?part=snippet%2CcontentDetails%2Cstatistics&id=${subscription.snippet.resourceId.channelId}&key=${apiKey}`,
                    };
                    const responseChannel = await axios.request<ChannelInfoResponse>(configChannel).then(data => data.data);
                    return { ...subscription, channelInfo: responseChannel }
                })
                return {
                    ...dataSubscription.data,
                    items: await Promise.all(subscriptionsWithChannelInfoPromise).then((value) => value)
                }
            });

            return responseApiBecauseClerkIsBadService
        },
        onSuccess: (data) => {
            setCurrentUserSubscriptions(data)
        }
    })

    const { isLoading: isLoadingPlaylists, isError: isErrorPlaylists/* , data: allPlaylists */ } = useQuery<YouTubePlaylistListResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        enabled: (isSignedIn !== undefined && isSignedIn === true && isLoaded === true),
        queryKey: ["YouTubeApiPlaylists"],
        queryFn: async () => {
            if (!apiKey) {
                throw "Missing Publishable Key";
            }
            const responseApiBecauseClerkIsBadService = await axios.get<YouTubePlaylistListResponse>(`${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${userId}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=playlists`);
            return responseApiBecauseClerkIsBadService.data
        },
        onSuccess: (data) => {
            setCurrentUserPlaylists(data)
        }
    })

    useEffect(() => {
        if (isLoadingPlaylists || isLoadingSubscriptions) {
            setTimeout(() => {
                queryClient.cancelQueries(["YouTubeApiSubscription"])
                queryClient.cancelQueries(["YouTubeApiPlaylists"])
            }, 15000)
        }
    })

    return (
        <>
            <aside
                className={`sticky top-0 overflow-y-auto scrollbar-hidden pb-4 flex flex-col ml-1 ${isLargeOpen ? "hidden" : "hidden lg:flex"}`}
            >
                <SmallSidebarItem IconOrImgUrl={Home} title="Home" url="/home" />
                <SmallSidebarItem IconOrImgUrl={Repeat} title="Shorts" url="/shorts" />
                <SmallSidebarItem IconOrImgUrl={MailCheck} title="Subscriptions" url="/subscriptions" />
                <SmallSidebarItem IconOrImgUrl={BookMarked} title="Library" url="/library" />
                <SmallSidebarItem IconOrImgUrl={History} title="History" url="/history" />
            </aside>
            {isSmallOpen && (
                <div
                    onClick={close}
                    className="lg:hidden fixed inset-0 z-[999] bg-secondary-dark opacity-50"
                />
            )}
            <aside
                id="largeSideBar"
                className={`w-56 bg-background z-[999] lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 ${isLargeOpen ? "lg:flex animate-slideIn-left" : "lg:hidden"} ${isSmallOpen ? "flex z-[999] bg-background max-h-screen animate-slideIn-left" : "animate-slideOut-right lg:animate-none transition-none"}`}
            >
                <div className="lg:hidden pt-2 pb-4 px-2 sticky top-0 bg-background">
                    <PageHeaderFirstSection
                        hidden={false}
                    />
                </div>
                <LargeSidebarSection>
                    <LargeSidebarItem isActive={pathname === "/"} IconOrImgUrl={Home} title="Home" url="/home" />
                    <LargeSidebarItem IconOrImgUrl={Repeat} title="Shorts" url="/shorts" />
                    <LargeSidebarItem IconOrImgUrl={MailCheck} title="Subscriptions" url="/subscriptions" />
                </LargeSidebarSection>
                <hr />
                <LargeSidebarSection visibleItemCount={7}>
                    <LargeSidebarItem
                        IconOrImgUrl={BookMarked}
                        title="Library"
                    // url="/library"
                    />
                    <LargeSidebarItem
                        IconOrImgUrl={History}
                        title="History"
                    // url="/history"
                    />
                    {
                        (isSignedIn !== undefined && isSignedIn !== false) ?
                            <>
                                <LargeSidebarItem
                                    IconOrImgUrl={PlaySquare}
                                    title="Your Videos"
                                    url="/your-videos"
                                />
                                <LargeSidebarItem
                                    IconOrImgUrl={Clock}
                                    title="Watch Later"
                                    url="/playlist?list=WL"
                                />
                            </>
                            : null
                    }
                    {
                        (isSignedIn === undefined || isSignedIn === false) ?
                            null
                            :
                            isLoadingPlaylists && currentPlaylists === undefined ?
                                playlists.map(playlist => (
                                    <LargeSidebarItem
                                        key={playlist.id}
                                        IconOrImgUrl={ListVideo}
                                        title={playlist.name}
                                        // url={`/`}
                                        moreClassNames={isLoadingPlaylists ? "animate-pulse" : ""}
                                    />
                                ))
                                :
                                (isErrorPlaylists || currentPlaylists === null) ?
                                    <div className="flex flex-col justify-center items-start gap-5 p-5 ">
                                        <p>An error happend looking for playlists.</p>
                                    </div>
                                    :
                                    <>
                                        <LargeSidebarItem
                                            IconOrImgUrl={ThumbsUp}
                                            title="Liked videos"
                                            isActive={pathname === "/liked"}
                                            url="/liked"
                                        />
                                        {currentPlaylists.items.map(playlist => (
                                            <LargeSidebarItem
                                                key={playlist.id}
                                                IconOrImgUrl={ListVideo}
                                                title={playlist.snippet.title}
                                                url={`https://www.youtube.com/playlist?list=${playlist.id}`}
                                            />
                                        ))}
                                    </>
                    }
                </LargeSidebarSection>
                {
                    (isSignedIn !== undefined && isSignedIn === true && isLoaded === true) ?
                        <>
                            <hr />
                            <LargeSidebarSection title="Subscriptions" visibleItemCount={5}>
                                {
                                    isLoadingSubscriptions && currentSubscriptions === undefined ?
                                        subscriptions.map((subscription) => {
                                            return (
                                                <LargeSidebarItem
                                                    key={subscription.id}
                                                    IconOrImgUrl={subscription.imgUrl}
                                                    title={subscription.channelName}
                                                    // url={`/@${subscription.id}`}
                                                    moreClassNames={isLoadingSubscriptions ? "animate-pulse" : ""}
                                                />
                                            )
                                        })
                                        :
                                        currentSubscriptions === null || isErrorSubscriptions ?
                                            <div className="flex flex-col justify-center items-start gap-5 p-5 ">
                                                <p>An error happend looking for playlists.</p>
                                            </div>
                                            :
                                            currentSubscriptions.items.map((subscription) => {
                                                return (
                                                    <LargeSidebarItem
                                                        key={subscription.id}
                                                        IconOrImgUrl={subscription.snippet.thumbnails.high.url}
                                                        title={subscription.snippet.title}
                                                        url={`https://www.youtube.com/${subscription.channelInfo.items[0].snippet.customUrl}`}
                                                    />
                                                )
                                            })
                                }
                            </LargeSidebarSection>
                        </>
                        :
                        <>
                            <hr />
                            <div className="flex flex-col justify-center items-start gap-5 p-5 ">
                                <p>Sign in to like videos, comment, and subscribe.</p>
                                <SignInButton>
                                    <Button className='flex justify-center items-center gap-2 border-muted-foreground border rounded-full p-2' variant={"ghost"}>
                                        <User />
                                        Sign In
                                    </Button>
                                </SignInButton>
                            </div>
                        </>
                }
                <hr />
                <LargeSidebarSection title="Explore">
                    <LargeSidebarItem
                        IconOrImgUrl={Flame}
                        title="Trending"
                    // url="/trending"
                    />
                    <LargeSidebarItem
                        IconOrImgUrl={ShoppingBag}
                        title="Shopping"
                    // url="/shopping"
                    />
                    <LargeSidebarItem IconOrImgUrl={Music2} title="Music" /* url="/music" */ />
                    <LargeSidebarItem
                        IconOrImgUrl={Film}
                        title="Movies & TV"
                    // url="/movies-tv"
                    />
                    <LargeSidebarItem IconOrImgUrl={Radio} title="Live" /* url="/live" */ />
                    <LargeSidebarItem
                        IconOrImgUrl={Gamepad2}
                        title="Gaming"
                    // url="/gaming"
                    />
                    <LargeSidebarItem IconOrImgUrl={Newspaper} title="News" /* url="/news" */ />
                    <LargeSidebarItem
                        IconOrImgUrl={Trophy}
                        title="Sports"
                    // url="/sports"
                    />
                    <LargeSidebarItem
                        IconOrImgUrl={Lightbulb}
                        title="Learning"
                    // url="/learning"
                    />
                    <LargeSidebarItem
                        IconOrImgUrl={Shirt}
                        title="Fashion & Beauty"
                    // url="/fashion-beauty"
                    />
                    <LargeSidebarItem
                        IconOrImgUrl={Podcast}
                        title="Podcasts"
                    // url="/podcasts"
                    />
                </LargeSidebarSection>
                <hr />
                <LargeSidebarSection>
                    <p className="flex justify-center text-primary/50">2023 Goggle LLC</p>
                </LargeSidebarSection>
            </aside>
        </>
    )
}

type SmallSidebarItemProps = {
    IconOrImgUrl: ElementType
    title: string
    url: string
}
function SmallSidebarItem({ IconOrImgUrl, title, url }: SmallSidebarItemProps) {
    return (
        <a
            href={url}
            className={twMerge(buttonStyles({ variant: "ghost" }), "py-4 px-0 flex flex-col items-center rounded-lg gap-1")}
        >
            <IconOrImgUrl className="w-6 h-6" />
            <div className='text-xs'>{title}</div>
        </a>
    )
}

type LargeSidebarSectionProps = {
    children: ReactNode
    title?: string;
    visibleItemCount?: number
}

function LargeSidebarSection({ children, title, visibleItemCount = Number.POSITIVE_INFINITY }: LargeSidebarSectionProps) {
    const [isExapanded, setIsExapanded] = useState(false)
    const childrenArray = React.Children.toArray(children).flat()
    const showExpandButton = childrenArray.length > visibleItemCount
    const visibleChildren = isExapanded ? childrenArray : childrenArray.slice(0, visibleItemCount)
    const ButtonIcon = isExapanded ? ChevronUp : ChevronDown

    return (
        <div>
            {title
                ? <div className='ml-4 mt-2 text-lg mb-1'>
                    {title}
                </div>
                : null
            }
            {visibleChildren}
            {showExpandButton ?
                <Button
                    onClick={() => setIsExapanded(e => !e)}
                    variant={"ghost"}
                    className={`w-full flex items-center rounded-lg gap-4 p-3`}
                >
                    <ButtonIcon className='w-6 h-6' />
                    <div>{isExapanded ? "Show Less" : "Show More"}</div>
                </Button>
                : null
            }
        </div>
    )
}

type LargeSidebarItemProps = {
    IconOrImgUrl: ElementType | string
    title: string
    url?: string
    isActive?: boolean
    moreClassNames?: string;
}
export function LargeSidebarItem({ isActive = false, IconOrImgUrl, title, url, moreClassNames }: LargeSidebarItemProps) {
    return (
        <Link
            to={url === undefined ? "/" : url}
            className={twMerge(buttonStyles({ variant: "ghost" }), `${moreClassNames} ${isActive ? "font-bold bg-primary-foreground hover:bg-primary-foreground" : ""} w-full flex items-center rounded-lg gap-4 p-3 px-5`)}
        >
            {typeof IconOrImgUrl === "string" ?
                <img src={IconOrImgUrl} className="w-6 h-6 rounded-full" />
                :
                <IconOrImgUrl className="w-6 h-6" />
            }
            <div className='whitespace-nowrap overflow-hidden text-ellipsis'>{title.slice(0, 13)}{title.length > 13 ? "..." : ""}</div>
        </Link>
    )
}

export default SideBar
import { Menu, User, Mic, Search, ArrowLeft, Upload, Bell, PlayIcon, LogOut, Settings, DollarSign, User2Icon, MoonIcon, Languages, LocateIcon } from 'lucide-react'
import logo from '../assets/logo.png'
import Button from '../components/Button'
import { useState, useEffect, ElementType } from 'react'
import { useSidebarContext } from '../contexts/SidebarContext'
import { ModeToggle } from '@/components/mode-toogle'
import { useTheme } from "@/components/theme-provider"
import { SignInButton, SignOutButton/* , UserButton */ } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
// import { dark } from '@clerk/themes';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from '@/components/ui/separator'
import { YouTubeVideoListResponse } from '@/utils/types'

type PageHeaderProps = {
    setCurrentUserId: React.Dispatch<React.SetStateAction<string>>
    setNextPageTokenLiked: React.Dispatch<React.SetStateAction<string>>
    setLikedVideos: React.Dispatch<React.SetStateAction<YouTubeVideoListResponse | null>>;
    setCurrentUserName: React.Dispatch<React.SetStateAction<string>>
}

function PageHeader({ setCurrentUserId, setNextPageTokenLiked, setLikedVideos, setCurrentUserName }: PageHeaderProps) {
    const [showFullWidthSearch, setShowFullWidthSearch] = useState(false)
    const { isSignedIn, isLoaded, user } = useUser();
    // const { theme } = useTheme()

    //https://clerk.com/docs/components/unstyled/sign-out-button?utm_source=www.google.com&utm_medium=referral&utm_campaign=none
    useEffect(() => {
        if (!!user) {
            setCurrentUserId(user.id)
            setCurrentUserName(user.username ?? user.firstName ?? user.fullName ??  "")
        }
    }, [user])

    return (
        <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
            <PageHeaderFirstSection hidden={showFullWidthSearch} />
            <form className={` gap-4 flex-grow justify-center ${showFullWidthSearch ? "flex" : "hidden md:flex"}`}>
                <Button
                    onClick={() => setShowFullWidthSearch(false)}
                    type='button'
                    size={"icon"}
                    variant={"ghost"}
                    className={`flex-shrink-0 ${showFullWidthSearch ? "flex md:hidden" : "hidden"}`}
                >
                    <ArrowLeft />
                </Button>
                <div className='flex flex-grow max-w-[600px]'>
                    <input
                        type="search"
                        placeholder='Search'
                        className='bg-background rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-lg w-full focus:border-blue-500'
                    />
                    <Button className='py px-4 rounded-r-full border border-secondary-border border-l-0 flex-shrink-0'>
                        <Search />
                    </Button>
                </div>
                <Button type='button' size={"icon"} className='flex-shrink-0'>
                    <Mic />
                </Button>
            </form>
            <div className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? "hidden md:flex" : "flex"}`}>
                <Button onClick={() => setShowFullWidthSearch(true)} size={"icon"} variant={"ghost"} className='md:hidden'>
                    <Search />
                </Button>
                <Button size={"icon"} variant={"ghost"} className='md:hidden'>
                    <Mic />
                </Button>
                <Button size={"icon"} variant={"ghost"} className=''>
                    <Upload />
                </Button>
                <Button size={"icon"} variant={"ghost"} className=''>
                    <Bell />
                </Button>
                {
                    isLoaded === false &&
                    <Button size={"icon"} variant={"ghost"}>
                        <User />
                    </Button>
                }
                {
                    isSignedIn ?
                        <Popover>
                            <PopoverTrigger>
                                <img className='h-8 rounded-full' src={user.imageUrl} alt="userImg" />
                            </PopoverTrigger>
                            <PopoverContent className='bg-secondary p-0 flex flex-col mr-3 pb-2'>
                                <div className='px-3 pt-5'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex justify-start items-start gap-5'>
                                            <img className='h-12 rounded-full' src={user.imageUrl} alt="userImg" />
                                            <div className='flex flex-col'>
                                                <p>{user.fullName}</p>
                                                <p>@{user.fullName}</p>
                                                <p
                                                    // target='_blank'
                                                    // href="https://myaccount.google.com/u/4/?utm_source=YouTubeWeb&tab=rk&utm_medium=act&tab=rk&hl=en"
                                                    className=' hover:underline active:underline text-sm'
                                                >
                                                    Manage your Google Account
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator className='h-[0.5px] bg-secondary-foreground my-2' />
                                <>
                                    <LargeSidebarItem
                                        IconOrImgUrl={User}
                                        title="Your Channel"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                    <LargeSidebarItem
                                        IconOrImgUrl={PlayIcon}
                                        title="YouTube Studio"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                    <LargeSidebarItem
                                        IconOrImgUrl={User2Icon}
                                        title="Switch account"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                    <SignOutButton
                                        signOutCallback={() => {
                                            console.log("sign out callback works")
                                            setCurrentUserId("")
                                            setNextPageTokenLiked("")
                                            setLikedVideos(null)
                                            setCurrentUserName("")
                                        }}
                                    >
                                        <div>
                                            <LargeSidebarItem
                                                IconOrImgUrl={LogOut}
                                                title="Sign Out"
                                                moreClassNames='hover:bg-primary/20 text-sm'
                                            />
                                        </div>
                                    </SignOutButton>
                                </>
                                <Separator className='h-[0.5px] bg-secondary-foreground my-2' />
                                <>
                                    <LargeSidebarItem
                                        IconOrImgUrl={DollarSign}
                                        title="Purchases and memberships"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                    <LargeSidebarItem
                                        IconOrImgUrl={User2Icon}
                                        title="YouTube Data"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                </>
                                <Separator className='h-[0.5px] bg-secondary-foreground my-2' />
                                <>
                                    <ModeToggle>
                                        <LargeSidebarItem
                                            IconOrImgUrl={MoonIcon}
                                            title="Appearance"
                                            moreClassNames='hover:bg-primary/20 text-sm'
                                        />
                                    </ModeToggle>
                                    <LargeSidebarItem
                                        IconOrImgUrl={Languages}
                                        title="Language"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                    <LargeSidebarItem
                                        IconOrImgUrl={LocateIcon}
                                        title="Location"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                </>
                                <Separator className='h-[0.5px] bg-secondary-foreground my-2' />
                                <>
                                    <LargeSidebarItem
                                        IconOrImgUrl={Settings}
                                        title="Settings"
                                        moreClassNames='hover:bg-primary/20 text-sm'
                                    />
                                </>
                            </PopoverContent>
                        </Popover>
                        :
                        <SignInButton
                        >
                            <Button className='flex justify-center items-center gap-2 border-muted-foreground border rounded-full p-2' variant={"ghost"}>
                                <User />
                                Sign In
                            </Button>
                        </SignInButton>
                }
            </div>
        </div>
    )
}


type PageHeaderFirstSectionProps = {
    hidden: boolean;
}

export function PageHeaderFirstSection({ hidden }: PageHeaderFirstSectionProps) {
    const { toogle } = useSidebarContext()
    const { theme } = useTheme()
    return (
        <div className={`flex gap-2 items-center flex-shrink-0 ${hidden ? "hidden md:flex" : "flex"} px-1`}>
            <Button onClick={toogle} variant="ghost" className=''>
                <Menu className='text-xl' />
            </Button>
            <a href="/">
                <img style={(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) || theme === "dark" ? { filter: "invert(120)" } : {}} src={logo} className='h-6' />
            </a>
        </div>
    )
}

type LargeSidebarItemProps = {
    IconOrImgUrl: ElementType | string
    title: string
    moreClassNames?: string;
}
export function LargeSidebarItem({ IconOrImgUrl, title, moreClassNames }: LargeSidebarItemProps) {
    return (
        <div
            className={`${moreClassNames} cursor-pointer w-full flex items-center rounded-lg gap-4 pl-5 py-2`}
        >
            <IconOrImgUrl className="w-6 h-6" />
            <div className='whitespace-nowrap overflow-hidden text-ellipsis'>{title}</div>
        </div>
    )
}


export default PageHeader


/* <Button size={'icon'}>
                            <UserButton
                                userProfileProps={{
                                    additionalOAuthScopes: {
                                        google: [
                                            'https://www.googleapis.com/auth/youtube.readonly',
                                            'https://www.googleapis.com/auth/youtube',
                                            'openid',
                                            'https://www.googleapis.com/auth/userinfo.email',
                                            'https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/youtube.download'
                                        ]
                                    }
                                }}
                                appearance={{
                                    baseTheme: (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) || theme === "dark" ? dark : undefined
                                }}
                                afterSignOutUrl='/'
                            />
                        </Button> */
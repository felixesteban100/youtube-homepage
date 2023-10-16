import { Menu, /* Upload, */ Bell, User, Mic, Search, ArrowLeft } from 'lucide-react'
import logo from '../assets/logo.png'
import Button from '../components/Button'
import { useState } from 'react'
import { useSidebarContext } from '../contexts/SidebarContext'
import { ModeToggle } from '@/components/mode-toogle'
import { useTheme } from "@/components/theme-provider"
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { dark } from '@clerk/themes';

function PageHeader() {
    const [showFullWidthSearch, setShowFullWidthSearch] = useState(false)
    const { isSignedIn, isLoaded } = useAuth();
    const { theme } = useTheme()

    return (
        <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
            <PageHeaderFirstSection
                hidden={showFullWidthSearch}
            />
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

                <Button size={"icon"} variant={"ghost"}>
                    <Bell />
                </Button>

                <ModeToggle />

                {
                    isLoaded === false &&
                    <Button size={"icon"} variant={"ghost"}>
                        <User />
                    </Button>
                }

                {
                    isSignedIn ?
                        <Button size={'icon'}>
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
                                afterSignOutUrl='http://localhost:5173'
                            />
                        </Button>
                        :
                        <SignInButton>
                            <Button size={"icon"} variant={"ghost"}>
                                <User />
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
        <div className={`flex gap-2 items-center flex-shrink-0 ${hidden ? "hidden md:flex" : "flex"}`}>
            <Button onClick={toogle} variant="ghost" className='mx-[0.9rem]'>
                <Menu className='text-xl' />
            </Button>
            <a href="/">
                <img style={(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) || theme === "dark" ? { filter: "invert(120)" } : {}} src={logo} className='h-6' />
            </a>
        </div>
    )
}

export default PageHeader
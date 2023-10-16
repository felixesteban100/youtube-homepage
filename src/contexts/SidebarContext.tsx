import { ReactNode, createContext, useState, useContext, useEffect } from 'react'

type SidebarProviderProps = {
    children: ReactNode
}

type SidebarContextType = {
    isLargeOpen: boolean;
    isSmallOpen: boolean
    toogle: () => void
    close: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebarContext(){
    const value = useContext(SidebarContext)

    if(value == null) throw Error('Cannot use outside of SidebarProvider')

    return value
}

export function SidebarProvider({ children }: SidebarProviderProps) {
    const [isLargeOpen, setIsLargeOpen] = useState(true)
    const [isSmallOpen, setIsSmallOpen] = useState(false)

    useEffect(() => {
        const handler = () => {
            if(!isScreenSmall()) setIsSmallOpen(false)
        }

        window.addEventListener("resize", handler)

        return () => {
            window.removeEventListener("resize", handler);
        }
    })

    function isScreenSmall(){
        return window.innerWidth < 1024
    }

    // add animation to the sidebar slideIn-left slideOut-right
    function toogle(){
        if(isScreenSmall()){
            setIsSmallOpen(s => !s)
        }else{
            setIsLargeOpen(l => !l)
        }
    }

    function close(){
        if(isScreenSmall()){
            setIsSmallOpen(false)
        }else{
            setIsLargeOpen(false)
        }
    }

    return (
        <SidebarContext.Provider value={{
            isLargeOpen,
            isSmallOpen,
            toogle,
            close
        }}>
            {children}
        </SidebarContext.Provider>
    )
}
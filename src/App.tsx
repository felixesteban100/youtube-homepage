import PageHeader from "./layouts/PageHeader"
import SideBar from './layouts/SideBar'
import { SidebarProvider } from './contexts/SidebarContext'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomeVideos from './layouts/HomeVideos'
import LikeVideos from './layouts/LikeVideos'
import { useCurrentUser } from "@/state/currentUser"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"

//https://developers.google.com/youtube/v3/docs
//https://console.cloud.google.com/apis/credentials?project=youtube-production-402002

function App() {
  const { user } = useUser()
  const { changeUser } = useCurrentUser()

  useEffect(() => {
    if(!!user){
      changeUser(user.username ?? user.firstName ?? user.fullName ?? "", user.id)
    }
  }, [user])

  return (
    <SidebarProvider>
      <div className="max-h-screen flex flex-col">
        <PageHeader />
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <SideBar />
          <Routes>
            <Route
              path="/"
              element={
                <HomeVideos />
              }
            />
            {
              useCurrentUser((state) => state).currentUser.id !== "" &&
              <Route
                path="/liked"
                element={
                  <LikeVideos />
                }
              />
            }
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App
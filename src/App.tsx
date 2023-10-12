import { useState } from 'react'
import CategoryPills from "./components/CategoryPills"
import { categories, videos } from "./data/home"
import PageHeader from "./layouts/PageHeader"
import VideoGridItems from './components/VideoGridItems'
import SideBar from './layouts/SideBar'
import { SidebarProvider } from './contexts/SidebarContext'

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <SidebarProvider>
      <div className="max-h-screen flex flex-col">
        <PageHeader />
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <SideBar />
          <div className='overflow-x-hidden px-8 pb-4'>
            <div className="sticky top-0 bg-background z-10 pb-4">
              <CategoryPills
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'>
              {videos.map(video => {
                return (
                  <VideoGridItems
                    key={video.id}
                    {...video}
                  />
                )
              })}

            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App

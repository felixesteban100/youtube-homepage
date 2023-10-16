export const REACT_QUERY_DEFAULT_PROPERTIES = {
    enabled: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onError: (error: any) => console.log(error),
}

// export const URL_CLERK_API = "http://localhost:5000"
export const URL_CLERK_API = "https://clerk-api-j0cy.onrender.com"

export const API_URL_CHANNELS = `https://youtube.googleapis.com/youtube/v3/channels`
export const API_URL_VIDEOS = `https://youtube.googleapis.com/youtube/v3/videos`
export const API_URL_SUBSCRIPTIONS = `https://youtube.googleapis.com/youtube/v3/subcriptions`
export const API_URL_CATEGORIES = `https://youtube.googleapis.com/youtube/v3/videoCategories`

export const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
export const clerkSecretKey = import.meta.env.VITE_CLERK_SECRET_KEY
export const REACT_QUERY_DEFAULT_PROPERTIES = {
    enabled: true,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onError: (error: any) => console.log(error),
}

export const URL_CLERK_API = import.meta.env.VITE_URL_CLERK_API

export const API_URL_CHANNELS = `https://youtube.googleapis.com/youtube/v3/channels`
export const API_URL_VIDEOS = `https://youtube.googleapis.com/youtube/v3/videos`
export const API_URL_SUBSCRIPTIONS = `https://youtube.googleapis.com/youtube/v3/subcriptions`
export const API_URL_CATEGORIES = `https://youtube.googleapis.com/youtube/v3/videoCategories`

export const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
export const clerkSecretKey = import.meta.env.VITE_CLERK_SECRET_KEY

export const DEFAULT_SEARCHPARAMS = {
    category_name: 'All',
    category_id: 999,
}

export function getSearchParamsFormatted(searchParams: URLSearchParams) {
    return {
        category_name: searchParams.get("category_name") ?? "All",
        category_id: parseInt(searchParams.get("category_id") ?? "0"),
    }
}

export const CATEGORIES_THAT_RETURN_ERROR = [
    "Travel & Events",
    "Gaming",
    "Videoblogging",
    "People & Blogs",
    "Movies",
    "Drama",
    "Family",
    "Foreign",
    "Sci-Fi/Fantasy",
    "Thriller",
    "Shorts",
    "Shows",
    "Trailers",
]
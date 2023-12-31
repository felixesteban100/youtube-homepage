/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_YOUTUBE_API_KEY: string
    readonly VITE_CLERK_PUBLISHABLE_KEY: string
    readonly VITE_CLERK_SECRET_KEY: string
    readonly VITE_URL_CLERK_API: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
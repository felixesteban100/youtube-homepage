import { DEFAULT_SEARCHPARAMS, getSearchParamsFormatted } from '@/data/constants';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'

// Custom hook to manage searchParams using localStorage
export function useSearchParamsForTheApp() {
    const [searchParams, setSearchParams] = useSearchParams(JSON.parse(localStorage.getItem("YOUTUBE_SEARCHPARAMS") ?? JSON.stringify(DEFAULT_SEARCHPARAMS)))

    useEffect(() => {
        localStorage.setItem("YOUTUBE_SEARCHPARAMS", JSON.stringify(getSearchParamsFormatted(searchParams)))
    }, [searchParams]);

    return { searchParams: getSearchParamsFormatted(searchParams), setSearchParams };
}
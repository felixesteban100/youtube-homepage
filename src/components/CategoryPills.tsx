import { useState, useRef, useEffect } from 'react'
import Button from "./Button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories, categoryAll } from '@/data/home'
import { YouTubeVideoCategoryListResponse } from '@/utils/types'
import { useQuery } from 'react-query'
import { API_URL_CATEGORIES, CATEGORIES_THAT_RETURN_ERROR, REACT_QUERY_DEFAULT_PROPERTIES, apiKey } from '../data/constants'
import axios from 'axios'
import { useSearchParamsForTheApp } from '@/hooks/useSearchParamsForTheApp'
import useQueryVideos from '@/api/useQueryVideos'

type CategoryPillsProps = {}

const TRANSLATE_AMOUNT = 200

function CategoryPills({ }: CategoryPillsProps) {
    const [isLeftVisible, setIsLeftVisible] = useState(false)
    const [isRightVisible, setIsRightVisible] = useState(false)
    const [translate, setTranslate] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const { refetchAllVideos } = useQueryVideos()

    const { searchParams, setSearchParams } = useSearchParamsForTheApp()

    const { isLoading: isLoadingCategories, isError: isErrorCategories, data: allCategories } = useQuery<YouTubeVideoCategoryListResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        queryKey: ["YouTubeApiCategories"],
        queryFn: async () => {
            if (!apiKey) throw "Missing Publishable Key";

            const configCategories = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${API_URL_CATEGORIES}?part=snippet&regionCode=US&key=${apiKey}`,
            };
            const responseCategories = await axios.request<YouTubeVideoCategoryListResponse>(configCategories)
            return responseCategories.data
        },
    })

    useEffect(() => {
        if (containerRef.current == null) return

        const observer = new ResizeObserver(entries => {
            const container = entries[0]?.target

            if (container == null) return

            setIsLeftVisible(translate > 0)
            setIsRightVisible(translate + container.clientWidth < container.scrollWidth)
        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [categories, translate])

    function setCategoryNameAndIdOnSearchParams(category_name: string, category_id: string) {
        setSearchParams((prev) => {
            prev.set("category_name", category_name)
            prev.set("category_id", category_id)
            return prev
        })
        setTimeout(() => {
            refetchAllVideos()
        }, 300)
    }

    return (
        <div ref={containerRef} className="overflow-x-hidden relative">
            <div
                className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]"
                style={{ transform: `translateX(-${translate}px)` }}
            >
                {
                    isLoadingCategories ?
                        categories.map((_, index) => {
                            return (
                                <div
                                    key={index}
                                    className="select-none py-1 px-3 rounded-lg whitespace-nowrap bg-primary/20 animate-pulse"
                                >
                                    {new Array(5).fill(0).map((_, index) => (
                                        <span key={index}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    ))}
                                </div>
                            )
                        }) : allCategories === undefined || isErrorCategories ? null
                            :
                            <>
                                <Button
                                    onClick={() => {
                                        setCategoryNameAndIdOnSearchParams(categoryAll.snippet.title, categoryAll.id)
                                    }}
                                    variant={"All" === searchParams.category_name ? "dark" : null}
                                    className="py-1 px-3 rounded-lg whitespace-nowrap"
                                >
                                    All
                                </Button>
                                {
                                    allCategories.items.map((category) => {
                                        if(!CATEGORIES_THAT_RETURN_ERROR.includes(category.snippet.title)){
                                            return (
                                                <Button
                                                    key={category.id}
                                                    onClick={() => {
                                                        setCategoryNameAndIdOnSearchParams(category.snippet.title, category.id)
                                                    }}
                                                    variant={category.snippet.title === searchParams.category_name ? "dark" : null}
                                                    className="py-1 px-3 rounded-lg whitespace-nowrap"
                                                >
                                                    {category.snippet.title}
                                                </Button>
                                            )
                                        }
                                    })
                                }
                            </>
                }
            </div>
            {
                isLeftVisible && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-background from-50% to-transparent w-24 h-full">
                        <Button
                            variant={"ghost"}
                            size="icon"
                            className="h-full aspect-square w-auto p-1.5"
                            onClick={() => {
                                setTranslate((translate) => {
                                    const newTranslate = translate - TRANSLATE_AMOUNT
                                    if (newTranslate <= 0) return 0
                                    return newTranslate
                                })
                            }}
                        >
                            <ChevronLeft />
                        </Button>
                    </div>
                )
            }
            {
                isRightVisible && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background from-50% to-transparent w-24 h-full flex justify-end">
                        <Button
                            variant={"ghost"}
                            size="icon"
                            className="h-full aspect-square w-auto p-1.5"
                            onClick={() => {
                                setTranslate((translate) => {
                                    if (containerRef.current === null) return translate
                                    const newTranslate = translate + TRANSLATE_AMOUNT
                                    const edge = containerRef.current.scrollWidth
                                    const width = containerRef.current.clientWidth
                                    if (newTranslate + width >= edge) {
                                        return edge - width
                                    }
                                    return newTranslate
                                })
                            }}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                )
            }

        </div>
    )
}

export default CategoryPills
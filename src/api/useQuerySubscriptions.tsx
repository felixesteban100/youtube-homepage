import { URL_CLERK_API, apiKey, clerkSecretKey, REACT_QUERY_DEFAULT_PROPERTIES, API_URL_CHANNELS } from '@/data/constants'
import useLocalStorage from '@/hooks/useLocalStorage'
import { ChannelInfoResponse, YouTubeSubscription, YouTubeSubscriptionResponse } from '@/utils/types'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

function useQuerySubscriptions() {
    const { isLoaded, isSignedIn, userId } = useAuth()
    const [currentSubscriptions, setCurrentUserSubscriptions] = useLocalStorage<YouTubeSubscriptionResponse | null>("YOUTUBE_SUBSCRIPTIONS", null)
    const { isLoading: isLoadingSubscriptions, isError: isErrorSubscriptions, data: allSubscriptions } = useQuery<YouTubeSubscriptionResponse>({
        ...REACT_QUERY_DEFAULT_PROPERTIES,
        enabled: currentSubscriptions === null && (isSignedIn === true && isLoaded === true),
        queryKey: ["YouTubeApiSubscription"],
        queryFn: async () => {
            if (!apiKey) {
                throw "Missing Publishable Key";
            }
            const responseApiBecauseClerkIsBadService = await axios.get<YouTubeSubscriptionResponse>(`${URL_CLERK_API}?clerkSecretKey=${clerkSecretKey}&userId=${userId}&apiYoutubeKey=${apiKey}&typeOfDATATOFETCH=subscriptions`).then(async (dataSubscription) => {
                const subscriptionsWithChannelInfoPromise: Promise<YouTubeSubscription>[] = await dataSubscription.data.items.map(async (subscription) => {
                    const configChannel = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: `${API_URL_CHANNELS}?part=snippet%2CcontentDetails%2Cstatistics&id=${subscription.snippet.resourceId.channelId}&key=${apiKey}`,
                    };
                    const responseChannel = await axios.request<ChannelInfoResponse>(configChannel).then(data => data.data);
                    return { ...subscription, channelInfo: responseChannel }
                })
                return {
                    ...dataSubscription.data,
                    items: await Promise.all(subscriptionsWithChannelInfoPromise).then((value) => value)
                }
            });

            return responseApiBecauseClerkIsBadService
        },
        onSuccess: (data) => {
            setCurrentUserSubscriptions(data)
        }
    })

    return { isLoadingSubscriptions, isErrorSubscriptions, allSubscriptions, currentSubscriptions, setCurrentUserSubscriptions }
}

export default useQuerySubscriptions
export type VideoItem = {
  kind: 'youtube#video'
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
    defaultAudioLanguage: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: boolean;
    licensedContent: boolean;
    contentRating: Record<string, unknown>; // Assuming it's an empty object
    projection: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
  channelInfo: ChannelInfoResponse;

  /* added recently */
  status: {
    uploadStatus: string;
    failureReason: string;
    rejectionReason: string;
    privacyStatus: string;
    publishAt: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
    madeForKids: boolean;
    selfDeclaredMadeForKids: boolean;
  };
  player: {
    embedHtml: string;
    embedHeight: number;
    embedWidth: number;
  };
};

export type ChannelInfoResponse = {
  etag: string;
  items: YouTubeChannel[];
  kind: string;
  pageInfo: {
    totalResults: number;
    resultPerPage: number;
  };
};

export type YouTubeVideoListResponse = {
  kind: string;
  etag: string;
  items: VideoItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  nextPageToken: string;
};

type Thumbnails = {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium: {
    url: string;
    width: number;
    height: number;
  };
  high: {
    url: string;
    width: number;
    height: number;
  };
  standard: {
    url: string;
    width: number;
    height: number;
  };
  maxres: {
    url: string;
    width: number;
    height: number;
  };
};

type YouTubeChannel = {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: Thumbnails;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
    country: string;
  };
  contentDetails: {
    relatedPlaylists: {
      likes: string;
      favorites: string;
      uploads: string;
    };
  };
  statistics: {
    viewCount: number;
    subscriberCount: number;
    hiddenSubscriberCount: boolean;
    videoCount: number;
  };
  topicDetails: {
    topicIds: string[];
    topicCategories: string[];
  };
  status: {
    privacyStatus: string;
    isLinked: boolean;
    longUploadsStatus: string;
    madeForKids: boolean;
    selfDeclaredMadeForKids: boolean;
  };
  brandingSettings: {
    channel: {
      title: string;
      description: string;
      keywords: string;
      trackingAnalyticsAccountId: string;
      moderateComments: boolean;
      unsubscribedTrailer: string;
      defaultLanguage: string;
      country: string;
    };
    watch: {
      textColor: string;
      backgroundColor: string;
      featuredPlaylistId: string;
    };
  };
  auditDetails: {
    overallGoodStanding: boolean;
    communityGuidelinesGoodStanding: boolean;
    copyrightStrikesGoodStanding: boolean;
    contentIdClaimsGoodStanding: boolean;
  };
  contentOwnerDetails: {
    contentOwner: string;
    timeLinked: string;
  };
  localizations: Record<
    string,
    {
      title: string;
      description: string;
    }
  >;
};

export type YouTubeSubscription = {
  kind: "youtube#subscription";
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    channelId: string;
    thumbnails: Record<
      string,
      {
        url: string;
        width: number;
        height: number;
      }
    >;
  };
  contentDetails: {
    totalItemCount: number;
    newItemCount: number;
    activityType: string;
  };
  subscriberSnippet: {
    title: string;
    description: string;
    channelId: string;
    thumbnails: Record<
      string,
      {
        url: string;
        width: number;
        height: number;
      }
    >;
  };
  channelInfo: ChannelInfoResponse;
};

export type YouTubeSubscriptionResponse = {
  kind: "youtube#SubscriptionListResponse";
  etag: string;
  items: YouTubeSubscription[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export type YouTubePlaylistListResponse = {
  kind: "youtube#playlistListResponse";
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: "youtube#playlist";
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      localized: {
        title: string;
        description: string;
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }[];
};

export type YouTubeVideoCategory = {
  kind: "youtube#videoCategory";
  etag: string;
  id: string;
  snippet: {
      channelId: "UCBR8-60-B28hp2BmDPdntcQ";
      title: string;
      assignable: boolean;
  };
};

export type YouTubeVideoCategoryListResponse = {
  kind: "youtube#videoCategoryListResponse";
  etag: string;
  items: YouTubeVideoCategory[]
}
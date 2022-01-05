import { useCallback, useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "store/reducers/Reducer";

import URL from "shared/functions/getURL";
import {
  Media,
  MediaSource,
  searchMedia,
  SearchMediaFilters,
  SearchMediaResult,
} from "shared/services/API/MediaAPI";

export type SearchMediaResultWithAssetDimensions = Omit<SearchMediaResult, "data"> & {
  data: Array<{
    media: Media;
    dimensions?: MediaAssetDimensions;
  }>;
};

export const useMediaPreloader = (filters: SearchMediaFilters) => {
  const [searchResult, setSearchResult] = useState<SearchMediaResultWithAssetDimensions | null>(null);
  const [pagination, setPagination] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const allUsers = useTypedSelector(state => state.usersInfoList);

  const getMedias = useCallback(
    async (
      page: number,
      lastIds: any,
      lastIdBlockchain: string,
      filters: SearchMediaFilters,
      forceRefreshCache: boolean
    ) => {
      try {
        setIsLoading(true);
        const { data, ...restNewSearchResult } = await searchMedia(
          {
            page,
            lastIds: lastIds ? JSON.stringify(lastIds) : null,
            lastIdBlockchain,
            filters,
            allUsers,
          },
          forceRefreshCache
        );
        const newData = await Promise.all(
          data
          .map(async media => {
            if (media.dimensions) {
              return {
                media,
                dimensions: media.dimensions,
              };
            } else {
              const mediaUrl = getMediaUrl(media);
              let dimensions: MediaAssetDimensions | undefined;
              if (mediaUrl) {
                try {
                  dimensions = await (isVideoUrl(mediaUrl)
                    ? preloadVideoAndGetDimenstions
                    : preloadImageAndGetDimenstions)(mediaUrl);
                } catch (e) {}
              }
              return {
                media,
                dimensions,
              };
            }
          })
        );
        setIsLoading(false);
        setSearchResult(prevSearchResult => ({
          ...restNewSearchResult,
          data: prevSearchResult ? [...prevSearchResult.data, ...newData] : newData,
        }));
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    },
    [allUsers]
  );

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      setPagination(1);
      setSearchResult(null);
      getMedias(1, null, "PRIVI", filters, false);
    }
  }, [allUsers, filters, getMedias]);

  const reload = useCallback(() => {
    if (allUsers && allUsers.length > 0) {
      setPagination(1);
      setSearchResult(null);
      getMedias(1, null, "PRIVI", filters, true);
    }
  }, [allUsers, getMedias, filters]);

  return useMemo(
    () => ({
      data: searchResult?.data ?? [],
      loadMore() {
        if (!isLoading) {
          setIsLoading(true);
          setPagination(pagination + 1);
          getMedias(
            pagination + 1,
            searchResult?.lastIds ?? null,
            searchResult?.lastIdBlockchain ?? "PRIVI",
            filters,
            false
          );
        }
      },
      hasMore: searchResult?.hasMore ?? true,
      reload,
      isLoading,
    }),
    [filters, getMedias, pagination, reload, searchResult, isLoading]
  );
};

// code is based on internals of MediaCard, should be merged somehow
export const getMediaUrl = (media: Media): string | undefined => {
  if (media.source === MediaSource.Privi && media.HasPhoto) {
    return `${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(/\s/g, "")}`;
  }

  if (media.source === MediaSource.Eth) {
    if (media.Url && media.Url.length > 0 && media.Url !== "" && media.Url !== "Error") {
      return media.Url;
    }

    if (media.mediaUrl && media.mediaUrl.length > 0 && media.mediaUrl !== "" && media.mediaUrl !== "Error") {
      return media.mediaUrl;
    }
  }
};

export const isVideoUrl = (url: string) => url.endsWith(".mp4");

export type MediaAssetDimensions = {
  width: number;
  height: number;
};

const PRELOAD_TIMEOUT = 2_000;

export const preloadVideoAndGetDimenstions = (url: string): Promise<MediaAssetDimensions> =>
  new Promise<MediaAssetDimensions>(resolve => {
    const video = document.createElement("video");

    video.addEventListener(
      "loadedmetadata",
      () => {
        clearTimeout(timeoutId);
        resolve({
          height: video.videoHeight,
          width: video.videoWidth,
        });
      },
      false
    );

    const timeoutId = setTimeout(() => {
      resolve({
        height: video.videoHeight,
        width: video.videoWidth,
      });
    }, PRELOAD_TIMEOUT);

    video.src = url;
  });

export const preloadImageAndGetDimenstions = (url: string): Promise<MediaAssetDimensions | undefined> =>
  new Promise<MediaAssetDimensions | undefined>(resolve => {
    const image = new Image();

    image.onload = () => {
      clearTimeout(timeoutId);
      resolve({
        height: image.height,
        width: image.width,
      });
    };

    const timeoutId = setTimeout(() => {
      resolve(undefined);
    }, PRELOAD_TIMEOUT);

    image.src = url;
  });

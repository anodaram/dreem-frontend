import axios from "axios";
import URL, { METAVERSE_URL } from "shared/functions/getURL";

const isDev = process.env.REACT_APP_ENV === "dev";

export const getUserInfo = async priviId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/public/user/${priviId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in getUserInfo:", error);
  }
};

export const getFeaturedWorlds = async filters => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/public/itemVersions/`,
      {
        featured: true,
        filters,
        isPublic: true,
        page: {
          page : 1,
          size : 10000,
          sort : "DESC"
        }
      },
      config
    );

    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getWorlds = async (
  portion = 10,
  pageNum = 1,
  sorting = "timestamp",
  filters = ["WORLD"],
  isPublic = true,
  ownerId?: string,
  itemIds?: any,
  isExtension?: boolean,
  featured = false
) => {
  try {
    let params: any = {};
    let page = {
      page : pageNum,
      size : portion,
      sort : "DESC"
    };
    params = { ...params, page };
    params = filters ? { ...params, filters } : params;
    params = isPublic ? { ...params, isPublic } : params;
    params = ownerId ? { ...params, ownerId } : params;
    params = itemIds && itemIds.length > 0 ? { ...params, itemIds } : params;
    params = isExtension !== undefined ? { ...params, isExtension } : params;
    params = featured !== undefined ? { ...params, featured } : params;

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/public/itemVersions/`,
      {
        ...params,
      },
      config
    );
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getCollections = async (
  portion = 10,
  pageNum = 1,
  sorting = "DESC",
  ownerId?: string,
) => {
  try {
    let params: any = {};
    let page = {
      page : pageNum,
      size : portion,
      sort : sorting
    };
    params = { ...params, page };
    params = ownerId ? { ...params, ownerId } : params;

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/public/collections/`,
      {
        ...params,
      },
      config
    );
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getCollection = async collectionId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(
      `${METAVERSE_URL()}/web/public/collections/${collectionId}/`,
      config
    );
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const uploadWorld = async payload => {
  try {
    const formData = new FormData();

    Object.keys(payload).forEach(key => {
      if (key === "worldImage" || key === "worldLevel" || key === "worldVideo")
        formData.append(key, payload[key], payload[key].name);
      else formData.append(key, payload[key]);
    });

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/worlds/upload/`, formData, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading world:", error);
  }
};

export const uploadCollection = async payload => {
  try {
    const formData = new FormData();

    Object.keys(payload).forEach(key => {
      if (key === "erc721CollectionImage")
        formData.append(key, payload[key], payload[key].name);
      else formData.append(key, payload[key]);
    });

    const token = localStorage.getItem("token");
    console.log('----- token is : ', token)
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/web/collections/create/`, formData, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in creating collection:", error);
  }
};

export const getAritsts = async (portion = 0, page = 0) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/getCreators/portion/${portion}/page/${page}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getArtist = async artistId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/creators/${artistId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getWorld = async worldId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/public/itemVersions/${worldId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading world:", error);
  }
};

export const getCharacters = async (worldId?: any, featured: undefined | boolean = undefined, ids?: any, isPublic: undefined | boolean = true) => {
  const body: any = {};
  // if (worldId) {
  //   body.worldIds = [Number(worldId)];
  // }
  if (featured) {
    body.featured = featured;
  }
  if (ids) {
    body.charactersId = ids;
  }
  if (isPublic) {
    body.isPublic = isPublic;
  }
  let pageData = {
    page : 1,
    size : 10000,
    sort : "DESC"
  };
  body.page = pageData;
  body.filters = ["CHARACTER"];
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/web/public/itemVersions/`, body, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in getCharacters:", error);
  }
};

export const getCharacterData = async characterId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/public/itemVersions/${characterId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in getCharacterData:", error);
  }
};

export const convertToNFTWorld = async (worldId, contractAddress, chain, nftId, metadataCID, owner, royaltyAddress) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/itemVersions/${worldId}/mint/`,
      {
        collectionAddress : contractAddress,
        tokenId : nftId,
        ownerAddress : owner,
        metadataUrl : metadataCID,
        chain : chain,
        royaltyPercentage : 15,
        royaltyAddress : royaltyAddress
      },
      config
    );
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const editWorld = async (worldId, payload) => {
  try {
    const formData = new FormData();

    Object.keys(payload).forEach(key => {
      if (key === "worldImage" || key === "worldLevel" || key === "worldVideo")
        formData.append(key, payload[key], payload[key].name);
      else formData.append(key, payload[key]);
    });

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/worlds/${worldId}/edit/`, formData, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteWorld = async worldId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.delete(`${METAVERSE_URL()}/web/public/itemVersions/${worldId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading world:", error);
  }
};

export const getUploadMetadata = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/public/getCoreText/`, {
      "key" : "upload_metadata"
    },
    config);
    console.log('----resp', resp)
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getNftGames = async (lastId: string, search: string, chain: string) => {
  const conf = {
    params: {
      lastId,
      search,
      chain,
      mode: process.env.REACT_APP_ENV || "dev",
    },
  };
  try {
    const resp = await axios.get(`${URL()}/metaverse/getNftGames/`, conf);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log(error);
  }
};

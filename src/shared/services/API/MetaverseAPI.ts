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
          page: 1,
          size: 10000,
          sort: "DESC",
        },
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

export const getAssets = async (
  portion = 10,
  pageNum = 1,
  sorting = "timestamp",
  filters = ["WORLD"],
  isPublic = true,
  ownerId?: string,
  itemIds?: any,
  isExtension?: boolean,
  featured = false,
  isMinted?: boolean
) => {
  try {
    let params: any = {};
    let page = {
      page: pageNum,
      size: portion,
      sort: "DESC",
    };
    params = { ...params, page };
    params = filters ? { ...params, filters } : params;
    params = isPublic ? { ...params, isPublic } : params;
    params = ownerId ? { ...params, ownerId } : params;
    params = itemIds && itemIds.length > 0 ? { ...params, itemIds } : params;
    params = isExtension !== undefined ? { ...params, isExtension } : params;
    params = featured !== undefined ? { ...params, featured } : params;
    params = isMinted !== undefined ? { ...params, isMinted } : params;

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

export const getCollections = async (portion = 10, pageNum = 1, sorting = "DESC", ownerId?: string) => {
  try {
    let params: any = {};
    let page = {
      page: pageNum,
      size: portion,
      sort: sorting,
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
    const resp = await axios.get(`${METAVERSE_URL()}/web/public/collections/${collectionId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getNFTInfo = async hashId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/asset/${hashId}/mint/metadata/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getUnfinishedNFTs = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/assets/batches/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getUnfinishedNFT = async hash => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/asset/${hash}/mint/batch/`, config);
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

export const uploadAsset = async payload => {
  try {
    const formData = new FormData();
    console.log(payload);
    Object.keys(payload).forEach(key => {
      if (key === "isPublic"){
        formData.append(key, payload[key]);
      }
      else{
        payload[key] && formData.append(key, payload[key]);
      }
    });

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/web/create/asset/upload/`, formData, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading asset:", error);
  }
};

export const uploadCollection = async payload => {
  try {
    const formData = new FormData();

    Object.keys(payload).forEach(key => {
      if (key === "erc721CollectionImage") formData.append(key, payload[key], payload[key].name);
      else formData.append(key, payload[key]);
    });

    const token = localStorage.getItem("token");
    console.log("----- token is : ", token);
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

export const getMapData = async () => {
  try {
    const resp = await axios.get(`${METAVERSE_URL()}/web/assets/map/`);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading map:", error);
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

export const getCharacters = async (
  worldId?: any,
  featured: undefined | boolean = undefined,
  ids?: any,
  isPublic: undefined | boolean = true
) => {
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
    page: 1,
    size: 10000,
    sort: "DESC",
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
    throw error;
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

export const getBatches = async hashId => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/asset/${hashId}/mint/batch/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in getBatches:", error);
  }
};

export const convertToNFTWorld = async (
  hashId,
  contractAddress,
  chain,
  nftId,
  metadataCID,
  owner,
  royaltyAddress,
  royaltyPercentage
) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/itemVersions/${hashId}/mint/`,
      {
        collectionAddress: contractAddress,
        tokenIds: nftId,
        ownerAddress: owner,
        metadataUrl: metadataCID,
        chain: chain,
        royaltyPercentage: royaltyPercentage,
        royaltyAddress: royaltyAddress,
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

export const convertToNFTAsset = async (
  hashId,
  contractAddress,
  chain,
  nftId,
  metadataCID,
  owner,
  royaltyAddress,
  royaltyPercentage,
  txHash,
  totalSupply
) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/itemVersions/${hashId}/mint/`,
      {
        collectionAddress: contractAddress,
        tokenIds: nftId,
        ownerAddress: owner,
        metadataUrl: metadataCID,
        chain: chain,
        royaltyPercentage: royaltyPercentage,
        royaltyAddress: royaltyAddress,
        tx: txHash,
        totalSupply: totalSupply,
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

export const convertToNFTAssetBatch = async (
  hashId,
  contractAddress,
  chain,
  nftId,
  metadataCID,
  owner,
  royaltyAddress,
  royaltyPercentage,
  txHash,
  totalSupply
) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/asset/${hashId}/mint/batch/`,
      {
        collectionAddress: contractAddress,
        tokenIds: nftId,
        ownerAddress: owner,
        metadataUrl: metadataCID,
        chain: chain,
        royaltyPercentage: royaltyPercentage,
        royaltyAddress: royaltyAddress,
        tx: txHash,
        totalSupply: totalSupply,
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

export const realmMint = async (
  hashId,
  txHash,
  chain,
  realmAddress,
  distributionManager,
  realmUpgraderAddress
) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/web/asset/${hashId}/mint/batch/`,
      {
        tx: txHash,
        chain: chain,
        realmAddress: realmAddress,
        realmDistributionAddress: distributionManager,
        realmUpgraderAddress: realmUpgraderAddress,
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
    const resp = await axios.post(
      `${METAVERSE_URL()}/public/getCoreText/`,
      {
        key: "upload_metadata",
      },
      config
    );
    console.log("----resp", resp);
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

export const getAssetTypes = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${METAVERSE_URL()}/web/create/assets/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getAssetMetadata = async (item: string) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/web/create/asset/`, { item }, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getDepositInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${URL()}/metaverse/realmDeposit/`, config)
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getProtocolFee = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.get(`${URL()}/metaverse/protocolFee/`, config)
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    throw error;
  }
};

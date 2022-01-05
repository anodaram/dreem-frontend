import axios from "axios";
import URL, { METAVERSE_URL } from "shared/functions/getURL";

const isDev = process.env.REACT_APP_ENV === "dev";
const net = isDev ? "test" : "main";

export const getFeaturedWorlds = async filters => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/items/`,
      {
        featured: true,
        net,
        filters,
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
  page = 1,
  sorting = "timestamp",
  filters = ["NFT_WORLD", "DRAFT_WORLD", "NFT_MEDIA"],
  onlyPublic = false,
  ownerId?: string,
  itemIds?: any,
  isExtension?: boolean
) => {
  try {
    let params: any = {
      net,
    };
    params = portion ? { ...params, portion } : params;
    params = page ? { ...params, page } : params;
    params = sorting ? { ...params, sorting } : params;
    params = filters ? { ...params, filters } : params;
    params = onlyPublic ? { ...params, onlyPublic } : params;
    params = ownerId ? { ...params, ownerId } : params;
    params = itemIds && itemIds.length > 0 ? { ...params, itemIds } : params;
    params = isExtension !== undefined ? { ...params, isExtension } : params;

    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/items/`,
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
    const resp = await axios.get(`${METAVERSE_URL()}/items/${worldId}/`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in uploading world:", error);
  }
};

export const getCharacters = async (worldId?: any, featured: undefined | boolean = undefined, ids?: any) => {
  const body: any = {};
  if (worldId) {
    body.worldIds = [Number(worldId)];
  }
  if (featured) {
    body.featured = featured;
  }
  if (ids) {
    body.charactersId = ids;
  }
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(`${METAVERSE_URL()}/characters/`, body, config);
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
    const resp = await axios.get(`${METAVERSE_URL()}/characters/${characterId}`, config);
    if (resp.data) {
      return resp.data;
    }
  } catch (error) {
    console.log("error in getCharacterData:", error);
  }
};

export const convertToNFTWorld = async (worldId, contractAddress, chain, nftId, metadataCID) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    const resp = await axios.post(
      `${METAVERSE_URL()}/items/${worldId}/nft/`,
      {
        contractAddress,
        chain,
        nftId,
        metadataCID,
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
    const resp = await axios.delete(`${METAVERSE_URL()}/items/${worldId}/`, config);
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
    const resp = await axios.get(`${METAVERSE_URL()}/getUploadMetadata/`, config);
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

import axios from "axios";
import URL from "shared/functions/getURL";

type UserFollowDTO = {
  firstName: string;
  lastName: string;
  numFollowings: number;
  numFollowers: number;
  trustScore: number;
  endorsementScore: number;
};

export type FollowResult = {
  name: string;
  numFollowings: number;
  numFollowers: number;
  trustScore: number;
  endorsementScore: number;
};

type FriendsResult = {
  user: string;
  accepted?: boolean;
  closenessDegree?: number;
  superFollower?: boolean;
};

export const followUser = async (userId: string): Promise<FollowResult> => {
  const response = await axios.post<
    | {
        success: true;
        data: UserFollowDTO;
      }
    | { success: false }
  >(`${URL()}/user/connections/followUser`, {
    userToFollow: userId,
  });

  if (!response.data.success) {
    throw new Error("Follow user failed");
  }

  const entry = response.data.data;

  return {
    ...entry,
    name: entry?.firstName,
  };
};

export const unfollowUser = async (userId: string): Promise<FollowResult> => {
  const response = await axios.post<
    | {
        success: true;
        data: UserFollowDTO;
      }
    | { success: false }
  >(`${URL()}/user/connections/unFollowUser`, {
    userToUnFollow: userId,
  });

  if (!response.data.success) {
    throw new Error("Unfollow user failed");
  }

  const entry = response.data.data;

  return {
    ...entry,
    name: entry?.firstName,
  };
};

export const applyClosenessDegree = async (
  userId: string,
  type: "Followers" | "Followings",
  closenessDegree: number
): Promise<void> => {
  const response = await axios.post<{ success: true } | { success: false }>(
    `${URL()}/user/connections/applyClosenessDegree`,
    {
      userToApplyClosenessDegree: userId,
      type,
      closenessDegree,
    }
  );

  if (!response.data.success) {
    throw new Error("Apply closeness failed");
  }
};

export type FollowEntry = {
  id: string;
  name: string;
  endorsementScore: number;
  trustScore: number;
  numFollowers: number;
  numFollowings: number;
  isFollowing: 0 | 1 | 2;
  closenessDegree: number;
  isFollower?: 1 | 2;
};

export const getFollowers = async (userId: string, isCurrentUser: boolean) => {
  if (!userId) {
    throw new Error("Invalid userId");
    return [];
  }
  const response = await axios.get<
    | {
        success: true;
        data: {
          followers: FollowEntry[];
        };
      }
    | { success: false }
  >(`${URL()}/user/connections/getFollowers/${userId}/${isCurrentUser}`);

  if (!response.data.success) {
    throw new Error("getFollowers failed");
  }

  return response.data.data.followers;
};

export const getFollowings = async (userId: string, isCurrentUser: boolean) => {
  if (!userId) {
    throw new Error("Invalid userId");
    return [];
  }
  const response = await axios.get<
    | {
        success: true;
        data: {
          followings: FollowEntry[];
        };
      }
    | { success: false }
  >(`${URL()}/user/connections/getFollowings/${userId}/${isCurrentUser}`);

  if (response.data.success === false) {
    throw new Error("getFollowings failed");
  }

  return response.data?.data?.followings || [];
};

export const getFriends = async (userId: string) => {
  const response = await axios.get<
    | {
        success: true;
        data: {
          friends: FriendsResult[];
        };
      }
    | { success: false }
  >(`${URL()}/user/getFriends/${userId}`);

  if (response.data.success == false) {
    throw new Error("getFriends failed");
  }

  return response.data?.data?.friends || [];
};

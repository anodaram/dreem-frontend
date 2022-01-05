import React, { useEffect, useState } from "react";
import { getUserAvatar, UserAvatarMetadata } from "shared/services/user/getUserAvatar";
import styles from "./UserAvatar.module.css";

type UserAvatarProps = {
  user: UserAvatarMetadata | undefined;
  onClick?: () => void;
};

export const UserAvatar: React.FunctionComponent<UserAvatarProps> = ({ user, onClick }) => {
  const [avatarUrl, setAvatarUrl] = useState(() => getUserAvatar(user));

  useEffect(() => {
    setAvatarUrl(getUserAvatar(user));
  }, [user]);

  return <div onClick={onClick} className={styles.root} style={{ backgroundImage: `url(${avatarUrl})`, cursor: 'pointer' }} />;
};

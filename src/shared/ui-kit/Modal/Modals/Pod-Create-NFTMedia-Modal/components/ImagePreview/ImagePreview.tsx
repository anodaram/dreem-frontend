import React from "react";
import styles from "./index.module.scss";
import placeholderUser from "assets/anonAvatars/ToyFaces_Colored_BG_111.jpg";

const ImagePreview = () => {
  return (
    <div className={styles.preview}>
      <img
        src="https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg"
        alt="background"
      />
      <div className={styles.info}>
        Stranger things
        <span className={styles.badge}>35%</span>
        <div>
          <img src={require('assets/icons/lockIcon.svg')} alt="user-icon" className={styles.icon} />
        </div>
      </div>
      <div className={styles.title}>
        <span>
          50%
          <div>Trust</div>
        </span>
        <div>
          50%
          <div>Endorsment</div>
        </div>
        <img src={placeholderUser} alt="avatar" className={styles.avatar} />
      </div>
    </div>
  );
};

export default ImagePreview;

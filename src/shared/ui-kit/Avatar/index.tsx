import React, { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import cls from "classnames";
import styles from "./index.module.scss";
import { sanitizeIfIpfsUrl } from "shared/helpers";

interface IAvatar extends Partial<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {
  type?: "text" | "image";
  size?: number;
  image?: string;
  variant?: string;
  radius?: number;
  rounded?: boolean;
  bordered?: boolean;
  text?: string;
  marginSides?: number;
}

const Avatar: FC<IAvatar> = ({
  image,
  type = "image",
  size = 50,
  radius = 16,
  variant = "",
  rounded = false,
  bordered = false,
  text = "",
  marginSides = 0,
  ...otherProps
}) => {
  return (
    <div
      className={cls(
        styles.avatar,
        { [styles.circle]: type === "text", [styles.bordered]: bordered },
        variant
      )}
      style={{
        borderRadius: rounded ? `50%` : `${radius}px`,
        width: `${size}px`,
        height: `${size}px`,
        marginRight: `${marginSides}px`,
        marginLeft: `${marginSides}px`,
      }}
      {...otherProps}
    >
      {type === "image" ? (
        <div
          style={{
            backgroundImage: image !== "" ? `url("${sanitizeIfIpfsUrl(image)}")` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: size,
            height: size,
            borderRadius: rounded ? `50%` : `${radius}px`,
          }}
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default Avatar;

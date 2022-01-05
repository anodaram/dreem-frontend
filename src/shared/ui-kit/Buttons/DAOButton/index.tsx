import React from "react";
import styles from "./index.module.css";
import cls from "classnames";

export type ButtonProps = React.PropsWithChildren<{
  icon?: true;
  onClick?: () => void;
  disableUpperCase?: boolean;
  insideCard?: boolean;
  disabled?: boolean;
}>;

export const DAOButton = ({
  icon,
  onClick,
  children,
  disableUpperCase,
  disabled,
  insideCard,
}: ButtonProps) => {
  return (
    <button className={styles.buttonContainer} onClick={onClick} disabled={disabled}>
      <div
        className={cls({ [styles.iconButton]: icon }, styles.buttonContent, {
          [styles.uppercase]: !disableUpperCase,
        })}
        style={{ backgroundColor: insideCard ? "rgb(33, 32, 33)" : "black" }}
      >
        {children}
      </div>
    </button>
  );
};

export const DAOButtonFilled = ({ icon, onClick, children, disableUpperCase, disabled }: ButtonProps) => {
  return (
    <button
      className={cls({ [styles.iconButton]: icon }, styles.buttonFilled, {
        [styles.uppercase]: !disableUpperCase,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const DAOButtonDark = ({ icon, onClick, children, disableUpperCase, disabled }: ButtonProps) => {
  return (
    <button
      className={cls({ [styles.iconButton]: icon }, styles.buttonDark, {
        [styles.uppercase]: !disableUpperCase,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const DAOButtonPlain = ({ icon, onClick, children, disableUpperCase, disabled }: ButtonProps) => {
  return (
    <button
      className={cls({ [styles.iconButton]: icon }, styles.buttonPlain, {
        [styles.uppercase]: !disableUpperCase,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

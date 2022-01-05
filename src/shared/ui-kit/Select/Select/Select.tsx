import React from "react";
import clsx from "clsx";
import { StyledMenuItem, StyledTextField } from "shared/ui-kit/Styled-components/StyledComponents";
import { SelectProps } from "./Select.props";
import { SelectStyles } from "./Select.styles";
import Box from "shared/ui-kit/Box";

export const Dropdown = (props: SelectProps) => {
  const { helperText, onChange, value, menuList, hasImage, className } = props;
  const classes = SelectStyles(props);

  return (
    <>
      <StyledTextField
        select
        variant="outlined"
        value={value}
        onChange={onChange}
        className={clsx(classes.root, className)}
      >
        {menuList.map(item => (
          <StyledMenuItem value={item.value}>
            <Box display="flex" alignItems="center" fontSize={14} fontWeight={700} color="#181818">
              {!!hasImage && (
                <img className={classes.tokenImage} src={require(`assets/${item.image}`)} alt={item.name} />
              )}
              {item.name}
            </Box>
          </StyledMenuItem>
        ))}
      </StyledTextField>
      {!!helperText && (
        <Box mt={1} fontSize={14} fontWeight={400} color="red">
          {helperText}
        </Box>
      )}
    </>
  );
};

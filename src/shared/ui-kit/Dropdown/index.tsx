import React, { useState } from 'react';
import classnames from 'classnames';

import { ReactComponent as DropDownIcon } from "assets/icons/arrow-down.svg";
import { ReactComponent as DropUpIcon } from "assets/icons/arrow-up.svg";

import { dropdownStyles } from './index.styles';

export const Dropdown = (props) => {
  const classes = dropdownStyles();
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getComponent = (key) => {
    return props.children.filter((comp) => {
      return comp.key === key;
    })
  }

  return (
    <div onClick={openDropdown} className={classnames(classes.root, props.className)}>
      {getComponent('closed')}
      {isOpen && getComponent('opened')}
      {isOpen ? (
        <DropUpIcon
          className={classes.dropdownArrow}
          onClick={toggleDropdown}
        />
      ) : (
        <DropDownIcon
          className={classes.dropdownArrow}
          onClick={toggleDropdown}
        />
      )}
    </div>
  );
};

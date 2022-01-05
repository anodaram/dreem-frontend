import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordtionSummary,
} from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Color, grid, FontSize } from "../../constants/const";
import { DropDownIcon } from "../Icons";

const BORDER_COLOR = '#b9b9b9';

export const Accordion = styled(MuiAccordion)`
  && {
    margin: 0;
    border: none;
    box-shadow: none;
    border-top: 1px solid ${BORDER_COLOR};
    border-bottom: 1px solid ${BORDER_COLOR};
    border-radius: 0;

    &.Mui-expanded {
      margin: 0;
    }

    &:not(:last-child) {
      margin-bottom: -1px;
    }
  }
`;

export const AccordionSummary = styled(MuiAccordtionSummary).attrs({ expandIcon: <DropDownIcon /> })`
  && {
    padding: 0;
    margin: 0;
    min-height: ${grid(6)};

    color: ${Color.GrayDark};
    font-size: ${FontSize.H5};

    &.Mui-expanded {
      min-height: ${grid(6)};
    }

    .MuiAccordionSummary-content {
      margin: 0 !important;
    }
  }
`;

export const AccordionDetails = styled(MuiAccordionDetails)`
  && {
    margin: 0;
    padding: ${grid(1)} 0 ${grid(3)} 0;
    border: none;
    box-shadow: none;
    display: block;
  }
`;

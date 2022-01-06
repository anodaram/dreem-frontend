const GRID_BASE = 8;

export const grid = (n: number) => `${n * GRID_BASE}px`;

export enum FontSize {
  H1 = "50px",
  H2 = "40px",
  H3 = "30px",
  H4 = "22px",
  H4_5 = "20px",
  H5 = "18px",
  H6 = "14px",

  XXL = "24px",
  XL = "18px",
  L = "16px",
  M = "14px",
  S = "11px",
}

export enum BorderRadius {
  S = "6px",
  M = "10px",
  L = "14px",
  XL = "20px",
}

export enum Color {
  Black = "#212121",
  White = "#ffffff",

  GrayDark = "#707582",
  GrayMedium = "#949BAB",
  GrayLight = "#EFF2F8",

  GrayHeaderInvisible = "#A1A2C5",
  GrayInputBorderSelected = "#727F9A",
  GrayInputPlaceholder = "#ABB3C3",
  GrayInputBorder = "#E0E4F3",
  GrayInputBackground = "#F7F9FE",

  GrayTab = "#656E7E",
  GreenTab = "#03EAA5",
  BlueTab = "#3f51b5",
  LightGrayTab = "#C5CAE9",

  GreenLight = "#DDFF57",
  Violet = "#9EACF2",

  LightRed = "#FF5954",
  Red = "#F43E5F",
  Green = "#65CB63",
  Yellow = "#FFD43E",
  Blue = "#7BE0EE",

  Mint = "#27E8D9",

  Purple = "#431AB7",

  MusicDAODark = "#2D3047",
  MusicDAOGreen = "#65CB63",
  MusicDAODeepGreen = "#1ABB00",
  MusicDAOLightBlue = "#54658F",
  MusicDAODeepBlue = "#2A27D3",
  MusicDAOLightGreen = "#DAE6E5",
  MusicDAOTightGreen = "#00D13B",
  MusicDAOOrange = "#FF9900",
  MusicDAOGray = "#7E7D95",

  NestedAMMDark = "#2D163C",
  NestedAMMGreen = "#D9F66F",
  NestedAMMPink = "#ea88f2",
  NestedAMMPurple = "#47295B",
}

export enum Gradient {
  Mint = "linear-gradient(97.4deg, #23D0C6 14.43%, #00CC8F 85.96%)",
  Magenta = "linear-gradient(97.4deg, #FF79D1 14.43%, #DB00FF 79.45%)",
  LightRed = "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
  Red = "linear-gradient(270deg, #FF254C -19.66%, #F4963E 100%)",
  BlueMagenta = "linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)",
  Green = "conic-gradient(from 111.31deg at 50% 51.67%, #B1FF00 -118.12deg, #00FF15 110.62deg, #B1FF00 241.88deg, #00FF15 470.63deg)",
  Green1 = "linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)",
  Pink = "linear-gradient(118.42deg, #EA88F2 12.03%, #A839FF 85.16%)",
}

export enum Variant {
  Primary = "Primary",
  Secondary = "Secondary",
  Tertiary = "Tertiary",
  Transaction = "Transaction",
  Transparent = "Transparent",
}
